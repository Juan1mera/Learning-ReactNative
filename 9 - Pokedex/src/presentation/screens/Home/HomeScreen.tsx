import { StyleSheet, View } from 'react-native'
import React from 'react'
import { FAB, Text, useTheme } from 'react-native-paper'
import { getPokemons } from '../../../actions'
import { useInfiniteQuery, useQuery, QueryClient, useQueryClient } from '@tanstack/react-query';
import PokeBallBg from '../../components/ui/PokeBallBg'
import { FlatList } from 'react-native-gesture-handler'
import { globalTheme } from '../../../config/theme/globalTheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PokemonCard from '../../components/pokemons/PokemonCard'
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/StackNavigator';


interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> {};

const HomeScreen = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets()
  const QueryClient = useQueryClient();

  const theme = useTheme()
  // const { isLoading, isError, data:pokemons,  } = useQuery({
  //   queryKey: ['pokemons'],
  //   queryFn: () => getPokemons(0),
  // });

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,
    staleTime: Infinity,
    // queryFn: () => getPokemons(0),
    queryFn: async(params) => {
      const pokemons = await getPokemons(params.pageParam);

      pokemons.forEach(pokemon => {
        QueryClient.setQueryData(['pokemon', pokemon.id], pokemon);
      });

      return pokemons;
    },
    getNextPageParam: (lastPage, pages) => pages.length,





  });


  return (
    <View style={globalTheme.globalMargin}>
      <PokeBallBg style={styles.imgPosition} />

      <FlatList 
        data={data?.pages.flat() ?? []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        style={{paddingTop: top+20}}
        ListHeaderComponent={() => (
          <Text variant='displayMedium'>Pokedex</Text>
        )}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={0.6}
        onEndReached={() => fetchNextPage()}
      />

      <FAB 
        label='Buscar'
        style={[
          globalTheme.fab,
          {backgroundColor: theme.colors.primary}
        ]}
        mode='elevated'
        color={theme.dark ? 'white' : 'dark'}
        onPress={() => navigation.push('SearchScreen')}
      />
      
    </View>
  );
};


export default HomeScreen


const styles = StyleSheet.create({
  imgPosition:{
    position: 'absolute',
    top: -100,
    right: -100,
  }
})