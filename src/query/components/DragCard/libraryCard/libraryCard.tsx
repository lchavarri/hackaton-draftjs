
import React from 'react';
import { Card, Button, ButtonGroup } from 'semantic-ui-react';

import { ILibraryFilter } from '../../layout/layoutTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';

type Props = {
  card: ILibraryFilter;
  index: number;
  hover?: boolean;
  isOpen?: boolean;

  toggleFilterLibraryHint?: any;
  toggleFilterLibraryDescription?: any;
};

type LibraryCardState = {
  showDescription: boolean;
};

export default class LibraryCard extends React.Component<
  Props,
  LibraryCardState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showDescription: false
    };
  }

  renderButtons = () => {
    const { card } = this.props;

    if (!card.description) return null;

    return (
      <ButtonGroup floated="right">
        <Button
          icon
          basic
          simple="true"
          className="xs"
          onClick={this.toggleDescription}
          id={'question-' + card.id}
        >
          <FontAwesomeIcon icon={faInfoCircle} aria-label="Show Description" />
        </Button>
      </ButtonGroup>
    );
  };

  renderDescription = () => {
    const { showDescription } = this.state;
    const { card } = this.props;

    if (!showDescription || !card.description) return null;

    return <Card.Description>{card.description}</Card.Description>;
  };

  toggleDescription = () =>
    this.setState({ showDescription: !this.state.showDescription });

  render() {
    const { card } = this.props;
    const { showDescription } = this.state;

    return (
      <div className={'library-card'} key={card.id} id={card.id}>
        <Card className={showDescription ? 'expanded' : 'collapsed'}>
          <Card.Content className="drag-handle">
            {this.renderButtons()}
            <Card.Header>{card.displayName}</Card.Header>
            {this.renderDescription()}
          </Card.Content>
        </Card>
      </div>
    );
  }
}
