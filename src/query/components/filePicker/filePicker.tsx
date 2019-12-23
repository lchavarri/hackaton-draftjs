import './filePicker.scss';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons';

type FilePickerProps = {
  updateFile: any;
  startUpload: any;
  children: any;
  invalidFormat: any;
  success: boolean;
};
type FilePickerState = {};

function FilePicker(props: FilePickerProps) {
  const onDrop = async ([file]: Array<any>) => {
    if (!file) return;
    const validFile: boolean =
      file.name.split('.')[file.name.split('.').length - 1] === 'json';
    if (!validFile) {
      props.invalidFormat();
    } else {
      props.startUpload();
    }
    var reader = new FileReader();
    reader.onload = function(e: any) {
      var contents = e.target.result;
      if (validFile) {
        props.updateFile(contents);
      }
    };
    reader.readAsText(file);
  };
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop: onDrop,
    multiple: false
  });

  const file = acceptedFiles.map((file: any) => {
    return (
      <Message className="transparent" key={file.path}>
        {' '}
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="icon green"
          aria-label="Success"
        />{' '}
        {file.path}
      </Message>
    );
  });

  const getDropState = (props: any) => {
    if (props.isDragAccept) {
      return 'drag-accept';
    }
    if (props.isDragReject) {
      return 'drag-reject';
    }
    if (props.isDragActive) {
      return 'drag-active';
    }
    return '';
  };

  return (
    <section className="file-picker">
      <div
        {...getRootProps({ className: 'dropzone' })}
        className={
          'dropzone ' +
          getDropState({ isDragActive, isDragAccept, isDragReject })
        }
      >
        <input {...getInputProps()} />
        <h3 className="header">Drop file here</h3>
        <p>
          or <a>browse</a> to choose a file
        </p>
        {props.children}
        {file && props.success ? file : ''}
      </div>
    </section>
  );
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  {}
)(FilePicker);
