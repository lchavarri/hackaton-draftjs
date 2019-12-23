import React, { useState, useContext } from 'react';
import { Tab, Button, StrictTabProps } from 'semantic-ui-react';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from 'react-transition-group';
import RequestNodeTrigger from '../../../shared/ui/components/modals/requestNode/requestNodeTrigger';
import appNames from '../../../shared/ui/appNames';
import { Context } from '../../../shared/ui/main/main';
//Local imports
import SavedPatterns from './filterDrawer/savedPatterns/SavedPatterns';
import FilterLibrary from './filterDrawer/filterLibrary/FilterLibrary';
import { sendEmail } from '../../utils/emailSenderUtil';

export default function TabBar(props: any) {
  const { showDrawer, setShowDrawer } = props;
  const [activeIndex, setActiveIndex] = useState<string | number | undefined>(
    1
  );
  const { documentId } = useContext(Context);

  function submit(args: any) {
    return sendEmail(args, documentId);
  }

  const panes = [
    {
      menuItem: (
        <Button
          key={1}
          basic
          className="icon"
          onClick={() => setShowDrawer(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      )
    },
    {
      menuItem: 'Filters',
      pane: (
        <Tab.Pane attached={false} key={2}>
          <FilterLibrary />
          <RequestNodeTrigger
            appName={appNames.EIDOS_QUERY}
            sendRequest={submit}
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Saved Patterns',
      pane: (
        <Tab.Pane attached={false} key={3}>
          <SavedPatterns />
          <RequestNodeTrigger
            appName={appNames.EIDOS_QUERY}
            sendRequest={submit}
          />
        </Tab.Pane>
      )
    }
  ];

  const duration = 300;

  const defaultStyle = {
    transition: `width ${duration}ms ease-in-out`,
    width: 320,
    opacity: 1
  };

  const transitionStyles = {
    entering: { width: 320, opacity: 0 },
    entered: { width: 320, opacity: 1 },
    exiting: { width: 0, opacity: 0 },
    exited: { width: 0 }
  };

  return (
    <Transition in={showDrawer} timeout={duration}>
      {state => (
        <Tab
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
          renderActiveOnly={false}
          activeIndex={activeIndex}
          className={'drawer' + (showDrawer ? ' visible' : '')}
          menu={{ secondary: true, pointing: true }}
          panes={panes}
          onTabChange={(e, data: StrictTabProps) => {
            setActiveIndex(
              data.activeIndex === 0 ? activeIndex : data.activeIndex
            );
          }}
        />
      )}
    </Transition>
  );
}
