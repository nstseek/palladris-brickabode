import React from 'react';
import Logo from '../../assets/logo.svg';
import './Header.scss';

const Link = ({ text, href = '' }) => (
  <a className='Link' href={href}>
    {text}
  </a>
);

const Header = () => (
  <div className='Header'>
    <div className='header-content'>
      <img src={Logo} className='logo'></img>
      <div className='links'>
        <Link text='Home' />
        <Link text='Services' />
        <Link text='About' />
        <Link text='Team' />
        <Link text='Contact' />
        <Link text='Logout' />
      </div>
    </div>
  </div>
);

export default Header;
