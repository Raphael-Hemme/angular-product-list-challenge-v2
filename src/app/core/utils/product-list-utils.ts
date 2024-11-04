import {
  ProductDetailsData,
  ProductListEntryData
} from '../services/api/api.service';
import { TOTAL_REGULAR_PAGES } from '../services/product-list/product-list.service';

export const getTypeSafeResponseDataOrDefault = (
  internalResponseData: ProductListEntryData[] | ProductDetailsData | null
): ProductListEntryData[] => {
  return Array.isArray(internalResponseData) ? internalResponseData : [];
};

export const generateInitiallyEmptyProductListCache =
  (): ProductListEntryData[][] => {
    return Array.from({ length: TOTAL_REGULAR_PAGES }, () => []);
  };
