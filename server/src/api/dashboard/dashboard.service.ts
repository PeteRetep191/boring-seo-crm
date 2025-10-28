//Models
import OfferModel, { IOfferDocument } from '@/models/offer.model';

// Пагинация + поиск по name/email
export const fetchDashboard = async () => {
  const offersCount = await OfferModel.countDocuments();

  return {
    sites: {
      total: 0,
      active: 0,
      archived: 0,
    },
    offers: {
      total: offersCount,
      active: offersCount,
      archived: 0,
    }
  };
};