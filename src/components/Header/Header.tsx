import React from 'react';
import pokedex from '../../assets/images/pokedex.png'

export const COMPONENT_ID = 'pokedex-header'

const Header = () => {
    return (
        <div className="header-container"  id={COMPONENT_ID}>
            <img src={pokedex} alt="pokedex logo" className='header-image' />
        </div>
    )
}

export default Header;