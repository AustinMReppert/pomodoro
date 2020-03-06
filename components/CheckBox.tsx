import React, { ChangeEvent } from "react";

interface CheckBoxProps {
  isChecked: boolean;
  name: string;
  onCheck(e: React.ChangeEvent<HTMLInputElement>): void;
}

interface CheckBoxState {
  isChecked: boolean;
}

class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
  constructor(props: CheckBoxProps) {
    super(props);
    this.state = {isChecked: props.isChecked };
  }

  render = () => {
    return <input type="checkbox" defaultChecked={this.props.isChecked} name={this.props.name} onChange={(e:ChangeEvent<HTMLInputElement>) => {
      this.setState({isChecked: !this.state.isChecked});
      this.props.onCheck(e);
    } } />;
  }
}

export default CheckBox;
