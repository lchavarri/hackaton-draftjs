import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-light-svg-icons';

type Props = {
  checked: boolean;
  onChange: any;
  id?: string;
  label?: string;
  radio?: boolean;
  value?: string | number | undefined;
};

type State = {};

class EidosCheckbox extends React.Component<any, State> {
  renderIcon = (checked: boolean) => {
    if (checked) {
      return <FontAwesomeIcon icon={faCheck} />;
    }
  };

  render() {
    const { checked, onChange, id, label, radio, value } = this.props;
    return (
      <div className={'ui checkbox svg' + (checked ? ' checked' : '')}>
        <input
          type={radio ? 'radio' : 'checkbox'}
          className="hidden"
          tabIndex={0}
          id={id}
          checked={checked}
          onChange={onChange}
          value={value}
        />
        <label htmlFor={id}>
          {this.renderIcon(checked)}
          {label}
        </label>
      </div>
    ); //<Checkbox {...this.props} />
  }
}

export default EidosCheckbox;
