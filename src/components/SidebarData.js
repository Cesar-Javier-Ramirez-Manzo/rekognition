import React from 'react';

import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Inicio',
    path: '/',
    icon: <IoIcons.IoMdHome />,
    cName: 'nav-text'
  },
  {
    title: 'Gestionar rostros',
    path: '/Indexar',
    icon: <IoIcons.IoIosImages />,
    cName: 'nav-text'
  },
  {
    title: 'Buscar en imagen',
    path: '/Buscar',
    icon: <IoIcons.IoIosSearch />,
    cName: 'nav-text'
  },
  {
    title: 'Buscar en video',
    path: '/Video',
    icon: <IoIcons.IoIosSearch />,
    cName: 'nav-text'
  }
  
];