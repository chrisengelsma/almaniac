import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isTipJarAvailable,
  isTipPurchaseCancelled,
  loadTipProducts,
  purchaseTip,
  type TipProduct,
} from '../lib/tipJar';

type TipJarStatus = 'idle' | 'loading' | 'ready' | 'unavailable';

export function useTipJar(active: boolean, onPurchaseSuccess?: () => void) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<TipProduct[]>([]);
  const [status, setStatus] = useState<TipJarStatus>('idle');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !isTipJarAvailable()) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setStatus('loading');
      setFeedback(null);

      try {
        const loadedProducts = await loadTipProducts();
        if (cancelled) {
          return;
        }

        setProducts(loadedProducts);
        setStatus('ready');
      } catch {
        if (!cancelled) {
          setProducts([]);
          setStatus('unavailable');
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [active]);

  const buyTip = useCallback(async (productId: string) => {
    setPurchasingId(productId);
    setFeedback(null);

    try {
      await purchaseTip(productId);
      onPurchaseSuccess?.();
    } catch (error) {
      if (!isTipPurchaseCancelled(error)) {
        setFeedback(t('modals.donate.feedbackError'));
      }
    } finally {
      setPurchasingId(null);
    }
  }, [t, onPurchaseSuccess]);

  return {
    products,
    status,
    purchasingId,
    feedback,
    buyTip,
    isAvailable: isTipJarAvailable(),
  };
}
