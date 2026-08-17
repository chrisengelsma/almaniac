import { NativePurchases, PURCHASE_TYPE, type Product } from '@capgo/native-purchases';
import { TIP_PRODUCT_IDS } from '../data/tipProducts';
import { getDonationChannel } from '../theme/supportLinks';

export interface TipProduct {
  id: string;
  title: string;
  priceString: string;
}

export function isTipJarAvailable(): boolean {
  return getDonationChannel() === 'iap';
}

function sortTipProducts(products: Product[]): TipProduct[] {
  const order = new Map<string, number>(TIP_PRODUCT_IDS.map((id, index) => [id, index]));

  return products
    .map((product) => ({
      id: product.identifier,
      title: product.title,
      priceString: product.priceString,
    }))
    .sort((left, right) => (order.get(left.id) ?? 99) - (order.get(right.id) ?? 99));
}

export async function loadTipProducts(): Promise<TipProduct[]> {
  if (!isTipJarAvailable()) {
    return [];
  }

  const { isBillingSupported } = await NativePurchases.isBillingSupported();
  if (!isBillingSupported) {
    return [];
  }

  const { products } = await NativePurchases.getProducts({
    productIdentifiers: [...TIP_PRODUCT_IDS],
    productType: PURCHASE_TYPE.INAPP,
  });

  return sortTipProducts(products);
}

export async function purchaseTip(productId: string): Promise<void> {
  await NativePurchases.purchaseProduct({
    productIdentifier: productId,
    productType: PURCHASE_TYPE.INAPP,
    quantity: 1,
  });
}

export function isTipPurchaseCancelled(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes('cancel') || message.includes('cancelled');
}
