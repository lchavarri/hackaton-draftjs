import React, { useContext, useEffect, useState } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';

import { Context } from './main';

export default function ActionsMenu(props: any) {
  const { menu, children } = props;
  const { fullscreen } = useContext(Context);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (menu && menu.menuCommands) {
      const getButtonsProps = (buttonIds: string[]) => {
        return menu.menuCommands.buttons
          .filter((b: any) => buttonIds.includes(b.id))
          .map((b: any) => ({
            key: b.id + new Date().getTime(),
            onClick: b.handler,
            name: b.label,
            text: b.label,
            disabled: menu.disabledCommandIds.includes(b.id),
            icon: menu.highlightedCommandIds.includes(b.id) ? 'check' : ''
          }));
      };
      const updatedItems = menu.menuCommands.subCommands.map(
        (subCommandId: any) => {
          const button = menu.menuCommands.buttons.find(
            (b: any) => b.id === subCommandId
          );
          if (button.subCommands) {
            const items = getButtonsProps(button.subCommands);
            return (
              <Dropdown item text={button.label} key={subCommandId}>
                <Dropdown.Menu>
                  {items.map((item: any) => (
                    <Dropdown.Item {...item}></Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            );
          } else {
            const item = getButtonsProps([button.id])[0];
            return <Menu.Item {...item}></Menu.Item>;
          }
        }
      );

      setMenuItems(updatedItems);
    }
  }, [menu]);

  const hideMenu = fullscreen || !menuItems || !menuItems.length;

  const wrapperStyles: any = hideMenu
    ? {}
    : { position: 'relative', paddingTop: '40px' };

  const menuJsx = hideMenu ? null : (
    <Menu size="mini" style={{ position: 'absolute', top: 0 }}>
      {menuItems}
    </Menu>
  );

  return (
    <div style={wrapperStyles} className="main">
      {menuJsx}
      {children}
    </div>
  );
}
