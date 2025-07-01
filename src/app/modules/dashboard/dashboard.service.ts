import { months } from '../../../helpers/month';
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

const getEarningChartData = async () => {
  const matchConditions = { status: { $in: ['complete'] } };

  const result = await Payment.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $addFields: {
        month: {
          $dateToString: {
            format: '%b',
            date: { $dateFromString: { dateString: '$_id' } },
          },
        },
        year: {
          $dateToString: {
            format: '%Y',
            date: { $dateFromString: { dateString: '$_id' } },
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: 1,
        totalAmount: 1,
        year: 1,
      },
    },
    {
      $group: {
        _id: '$year',
        earnings: {
          $push: {
            month: '$month',
            totalAmount: '$totalAmount',
          },
        },
      },
    },
    {
      $addFields: {
        allMonths: months,
      },
    },
    {
      $project: {
        earnings: {
          $map: {
            input: '$allMonths',
            as: 'month',
            in: {
              $let: {
                vars: {
                  monthData: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$earnings',
                          as: 'item',
                          cond: { $eq: ['$$item.month', '$$month'] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  month: '$$month',
                  totalAmount: { $ifNull: ['$$monthData.totalAmount', 0] },
                },
              },
            },
          },
        },
      },
    },
  ]);

  return result;
};

export const DashboardService = { getStatics, getEarningChartData };
