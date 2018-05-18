import React, { PureComponent } from 'react';

import { Upload, Icon, message } from 'antd';

import { getGatewayPath } from '../../utils/utils';
import { getAuthority } from '../../utils/authority';

import styles from './Cover.less';

const format = ['image/jpeg', 'image/png'];
const maxFileSize = 1024 * 1024 * 2;

function beforeUpload(file) {
  const isImg = format.includes(file.type);
  if (!isImg) {
    message.error(`你只能上传 ${format.join('，')} 格式的图片作为封面!`);
  }
  const isLt2M = file.size < maxFileSize;
  if (!isLt2M) {
    message.error('封面图片不能大于 2MB!');
  }
  return isImg && isLt2M;
}

export default class Cover extends PureComponent {
  state = {
    value: null,
    loading: false,
  };
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }
  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) onChange(changedValue);
  };
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.triggerChange(info.file.response[0].id);
      this.setState({
        value: info.file.response[0].id,
        loading: false,
      });
    }
  };
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const { value } = this.state;
    return (
      <Upload
        name="attachments"
        listType="picture-card"
        className={styles.uploader}
        showUploadList={false}
        action={`${getGatewayPath()}/attachment/upload`}
        withCredentials
        headers={{
          'Access-Control-Allow-Credentials': 'true',
          Authorization: `Bearer ${getAuthority()}`,
        }}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {value ? (
          <img src={`${getGatewayPath()}/attachment/download/${value}`} alt="" />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}
