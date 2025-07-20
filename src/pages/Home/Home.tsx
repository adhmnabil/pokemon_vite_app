import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getPokemon } from '../../api/pokeapi';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import Pagination from '../../components/Pagination/Pagination';
import { Pokemon } from '../../types/typing';

export const COMPONENT_ID = 'pokedex-home'

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pokemons, setPokemons] = useState([] as Pokemon[]);
    const [viewMode, setViewMode] = useState<'pagination' | 'infinite'>('pagination');
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observer = useRef<IntersectionObserver>();
    
    const itensPerPage = 20;

    const fetchPokemons = async (reset = false) => {
        try {
            const currentPage = reset ? 0 : page;
            const data = await getPokemon(itensPerPage, itensPerPage * currentPage);
            
            if (reset) {
                setPokemons(data?.pokemons || []);
                setPage(0);
            } else if (viewMode === 'infinite') {
                setPokemons(prev => [...prev, ...(data?.pokemons || [])]);
            } else {
                setPokemons(data?.pokemons || []);
            }
            
            setTotalPages(Math.ceil(data?.count / itensPerPage));
            setHasMore((currentPage + 1) * itensPerPage < data?.count);

            setTimeout(() => {
                setLoading(false);
                setLoadingMore(false);
            }, 1500);
        } catch (error) {
            console.log('fetchPokemons error:', error);
            setLoading(false);
            setLoadingMore(false);
            throw new Error('🧪 Check connection');
        }
    }

    const handleBackPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    }

    const handleNextPage = () => {
        if (page + 1 !== totalPages) {
            setPage(page + 1);
        }
    }

    const loadMorePokemons = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const nextPage = Math.floor(pokemons.length / itensPerPage);
        
        try {
            const data = await getPokemon(itensPerPage, itensPerPage * nextPage);
            setPokemons(prev => [...prev, ...(data?.pokemons || [])]);
            setHasMore((nextPage + 1) * itensPerPage < data?.count);
            setLoadingMore(false);
        } catch (error) {
            console.log('loadMorePokemons error:', error);
            setLoadingMore(false);
            throw new Error('🧪 Check connection');
        }
    }, [pokemons.length, hasMore, loadingMore]);

    const lastPokemonElementRef = useCallback((node: HTMLDivElement) => {
        if (loading || viewMode !== 'infinite') return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loadingMore) {
                loadMorePokemons();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadingMore, loadMorePokemons, viewMode]);

    const handleViewModeChange = (newMode: 'pagination' | 'infinite') => {
        setViewMode(newMode);
        setLoading(true);
        setLoadingMore(false);
        
        if (newMode === 'pagination') {
            setPage(0);
            fetchPokemons(true);
        } else {
            setPokemons([]);
            setPage(0);
            fetchPokemons(true);
        }
    }

    useEffect(() => {
        if (viewMode === 'pagination') {
            setLoading(true);
            fetchPokemons();
        }
    }, [page, viewMode]);

    useEffect(() => {
        fetchPokemons(true);
    }, []);

    const renderPokemonCards = () => {
        return pokemons.map((pokemon: Pokemon, index: number) => {
            const isLast = index === pokemons.length - 1;
            
            return (
                <div
                    key={pokemon.id || index}
                    ref={viewMode === 'infinite' && isLast ? lastPokemonElementRef : null}
                >
                    <Card pokemon={pokemon} />
                </div>
            );
        });
    };

    return (
        <div id={COMPONENT_ID}>
            <div className="view-mode-toggle">
                <button 
                    className={`toggle-btn ${viewMode === 'pagination' ? 'active' : ''}`}
                    onClick={() =>{
                        if(viewMode === 'pagination'){
                            return
                        }
                        handleViewModeChange('pagination')
                    }}
                >
                    Pagination
                </button>
                <button 
                    className={`toggle-btn ${viewMode === 'infinite' ? 'active' : ''}`}
                    onClick={() =>{
                        if(viewMode === 'infinite'){
                            return
                        }
                        handleViewModeChange('infinite')
                    }}
                >
                    Infinite Scroll
                </button>
            </div>

            {!loading ? (
                <div className="container">
                    <div className="pokemon-list-container">
                        {renderPokemonCards()}
                    </div>
                    
                    {viewMode === 'pagination' && (
                        <Pagination
                            page={page + 1}
                            totalPages={totalPages}
                            handleBackPage={handleBackPage}
                            handleNextPage={handleNextPage}
                        />
                    )}
                    {viewMode === 'infinite' && loadingMore && (
                        <div className="loading-more">
                            <Loading />
                        </div>
                    )}
                    
                    {viewMode === 'infinite' && !hasMore && !loadingMore && (
                        <div className="end-message">
                            <p>You've seen all Pokémon!</p>
                        </div>
                    )}
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default Home;