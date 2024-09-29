"use client"
import { HelloWorld } from '@/types/Home';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<HelloWorld | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${token}`, // Uncomment if using auth
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Conditional rendering for loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-24">
      <div>
        <h1 className="text-3xl font-bold">Project Pulse yuhhhhh</h1>
        {data ? (
          <div>{data.message}</div>
        ) : (
          <div>No data available.</div>
        )}
      </div>
    </section>
  );
}
