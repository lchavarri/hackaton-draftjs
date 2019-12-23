import React from 'react';
import { Card, Button, ButtonGroup, Dropdown } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { format } from 'date-fns';

// Local imports
import { QueryPattern } from '../../../redux/actions/savedPatternsActions';

interface SavedQueryPattern extends QueryPattern {
  id?: string;
}

type Props = {
  pattern: SavedQueryPattern;
  isOwner: boolean;
  highlighted: string;
  openEditModal: Function;
  openDeleteModal: Function;
};

type LibraryCardState = {
  isOpen: boolean;
};

export default class LibraryCard extends React.Component<
  Props,
  LibraryCardState
> {
  state = {
    isOpen: false,
    modalOpen: false
  };

  componentDidMount() {
    const { highlighted } = this.props;

    // Highlight on mount
    if (highlighted) {
      this.openDescription();
    }
  }

  componentDidUpdate(prevProps: any) {
    const { highlighted } = this.props;

    // If search term has changed,
    if (prevProps.highlighted !== highlighted) {
      this.openDescription();
    }
  }

  openDescription = () => {
    const { pattern, highlighted } = this.props;
    let { description } = pattern;
    description = description || '';

    const isOpen =
      !!highlighted.length &&
      description.toLocaleLowerCase().includes(highlighted.toLocaleLowerCase());
    // Search in saved pattern description and open content if found
    this.setState({
      isOpen
    });
  };

  toggleDescription = () => this.setState({ isOpen: !this.state.isOpen });

  highlightText = (text: string, token: string) => {
    if (!text.length) return null;
    if (!token.length) return text;

    // Escaping special chars
    const searchToken = token.replace(/[-[\]{}()*+?.,\\/^$|#\s]/gi, '\\$&');

    // Replacing text with regex
    var pattern = new RegExp(searchToken, 'gi');
    const replaced = text.replace(pattern, (match: string) => {
      return `¨${match}¨`;
    });

    // Split text.
    const splittedText = replaced.split('¨');

    if (splittedText.length > 1) {
      return splittedText.map((item: string, i) => {
        // Highlight text if item matches search.
        if (item.toLowerCase() === token.toLowerCase()) {
          return (
            <span key={i} className="highlighted-text">
              {item}
            </span>
          );
        }

        return item;
      });
    } else {
      return splittedText[0];
    }
  };

  // Render utility methods
  renderButtonGroup = () => {
    const { pattern } = this.props;

    if (!pattern.description) return null;

    return (
      <Button
        icon
        basic
        simple="true"
        className="xs"
        onClick={this.toggleDescription}
        id={'question-' + pattern.name}
      >
        <FontAwesomeIcon icon={faInfoCircle} aria-label="Show Description" />
      </Button>
    );
  };

  renderDescription = () => {
    if (!this.state.isOpen) return null;
    const { pattern, highlighted } = this.props;

    return (
      <Card.Description>
        {this.highlightText(pattern.description, highlighted)}
      </Card.Description>
    );
  };

  cardOptions = [
    {
      key: 'edit',
      text: 'Edit Details',
      selected: false,
      onClick: () => this.props.openEditModal(this.props.pattern)
    },
    {
      key: 'delete',
      text: 'Delete',
      selected: false,
      onClick: () => this.props.openDeleteModal(this.props.pattern)
    }
  ];

  renderDropdown = () => {
    if (!this.props.isOwner) return null;

    return (
      <Dropdown
        trigger={<FontAwesomeIcon icon={faEllipsisV} className="fa-lg" />}
        className="icon"
        direction="right"
        options={this.cardOptions}
      />
    );
  };

  render() {
    const { isOpen } = this.state;
    const { pattern, highlighted } = this.props;
    const createdDate = format(pattern.createdAt || '', 'MM/DD/YYYY');

    return (
      <div className="saved-card" key={pattern.name} id={pattern.id}>
        <Card className={isOpen ? 'expanded' : 'collapsed'}>
          <Card.Content className="drag-handle">
            <ButtonGroup floated="right">
              {this.renderButtonGroup()}
              {this.renderDropdown()}
            </ButtonGroup>
            <Card.Meta>SAVED PATTERN</Card.Meta>
            <Card.Header>
              {this.highlightText(pattern.name, highlighted)}
            </Card.Header>
            {this.renderDescription()}
          </Card.Content>
          <Card.Content extra>
            <Card.Meta className="right">
              Date Created: {this.highlightText(createdDate, highlighted)}
            </Card.Meta>
            <Card.Meta>
              <span className="initial">{pattern.initials}</span>
              <span>{this.highlightText(pattern.document, highlighted)}</span>
            </Card.Meta>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
