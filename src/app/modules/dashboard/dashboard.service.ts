import { Payment } from '../payment/payment.model';
import { User } from '../user/user.model';

const getStatics = async () => {
  const totalUsers = await User.countDocuments();

  const amount = await Payment.aggregate([
    {
      $match: {
        status: 'complete',
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
  const totalAmount = amount[0]?.totalAmount;
  return { totalUsers, totalAmount };
};

export const DashboardService = { getStatics };
