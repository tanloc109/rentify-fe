import React, { useState, useEffect } from 'react';

type WithDataFetchingProps = {
  fetchData: () => Promise<any>;
  children: (data: any, error: string | null) => JSX.Element;
};

const withDataFetching = ({ fetchData, children }: WithDataFetchingProps) => {
  const DataFetchingComponent: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetch = async () => {
        try {
          const result = await fetchData();
          setData(result);
        } catch (err) {
          setError('Error fetching data...');
          console.error('Error:', err);
        }
      };
      fetch();
    }, [fetchData]);

    return children(data, error);
  };

  return <DataFetchingComponent />;
};

export default withDataFetching;
