import OrderSummaryChart from '../component/chart/OrderSummaryChart';
import RevenueSummary from '../component/chart/RevenueSummary';
import { UserContext } from '../App';
import { useContext } from 'react';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const accessToken = user?.accessToken;

    return (
        <div className="flex justify-center items-center min-h-screen">
            <OrderSummaryChart accessToken={accessToken} />
            <RevenueSummary accessToken={accessToken} />
        </div>
    );
};

export default Dashboard;
