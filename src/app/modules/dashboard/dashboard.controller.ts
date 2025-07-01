import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './dashboard.service';

const getStatics = catchAsync(async (req, res) => {
  const result = await DashboardService.getStatics();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard retrived successfully',
    data: result,
  });
});

const getEarningChartData = catchAsync(async (req, res) => {
  const result = await DashboardService.getEarningChartData();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard retrived successfully',
    data: result,
  });
});

export const DashboardController = {
  getStatics,
  getEarningChartData,
};
