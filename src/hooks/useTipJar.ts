import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchTipProduct,
  isTipJarAvailable,
  isTipPurchaseCancelled,
  loadTipProducts,
  mergeTipProducts,
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
      if (!products.some((product) => product.id === productId)) {
        const product = await fetchTipProduct(productId);
        if (!product) {
          setFeedback(t('modals.donate.feedbackUnavailable'));
          return;
        }

        setProducts((current) => mergeTipProducts(current, product));
      }

      await purchaseTip(productId);
      onPurchaseSuccess?.();
    } catch (error) {
      if (!isTipPurchaseCancelled(error)) {
        console.warn('[tipJar] purchase failed', productId, error);
        setFeedback(t('modals.donate.feedbackError'));
      }
    } finally {
      setPurchasingId(null);
    }
  }, [products, t, onPurchaseSuccess]);

  return {
    products,
    status,
    purchasingId,
    feedback,
    buyTip,
    isAvailable: isTipJarAvailable(),
  };
}
