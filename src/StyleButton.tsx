import React from "react";

type Props = {
  label: string;
  style: any;
  active: boolean;
  onToggle: (style: any) => void;
};

const StyleButton = (props: Props) => {
  const { onToggle, style, active, label } = props;

  const activeClass = active ? "RichEditor-activeButton" : "";
  const className = `RichEditor-styleButton ${activeClass}`;

  function handleToggle(e: any) {
    e.preventDefault();
    onToggle(style);
  }

  return (
    <span className={className} onMouseDown={handleToggle}>
      {label}
    </span>
  );
};

export default StyleButton;
