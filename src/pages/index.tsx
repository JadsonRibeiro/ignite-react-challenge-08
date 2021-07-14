import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

import { ImagesQueryResponse } from '../types';

export default function Home(): JSX.Element {
  async function requestImages({
    pageParam = undefined,
  }): Promise<ImagesQueryResponse> {
    const { data } = await api.get<ImagesQueryResponse>('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', requestImages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    if (!data) return [];

    // return data.pages.map(page => page.data).flat();

    return data.pages.reduce(
      (acc, currentPage) => [...acc, ...currentPage.data],
      []
    );
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
