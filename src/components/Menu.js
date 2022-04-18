import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';

import './Menu.css';

const MainMenu = ({ account }) => {
  const [activeItem, setActiveItem] = useState('todoList');

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu className='main_menu' inverted>
      <Menu.Item
        name='blockchain todo list'
        active={activeItem === 'todoList'}
        onClick={handleItemClick}
      />
      <Menu.Item
        name='messages'
        active={activeItem === 'messages'}
        onClick={handleItemClick}
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name={`account`}
          active={activeItem === 'account'}
          onClick={handleItemClick}
        />
        <p className='account'>| {account}</p>
      </Menu.Menu>
    </Menu>
  );
};

export default MainMenu;
