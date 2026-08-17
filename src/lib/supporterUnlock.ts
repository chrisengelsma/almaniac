import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';
import { TIP_PRODUCT_IDS } from '../data/tipProducts';
import { isTipJarAvailable } from './tipJar';

const TIP_PRODUCT_ID_SET = new Set<string>(TIP_PRODUCT_IDS);

export async function detectSupporterUnlockFromPurchases(): Promise<boolean> {
  if (!isTipJarAvailable()) {
    return false;
  }

  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported();
    if (!isBillingSupported) {
      return false;
    }

    const { purchases } = await NativePurchases.getPurchases({
      productType: PURCHASE_TYPE.INAPP,
    });

    return purchases.some(
      (purchase) =>
        TIP_PRODUCT_ID_SET.has(purchase.productIdentifier) && purchase.revocationDate == null,
    );
  } catch {
    return false;
  }
}
