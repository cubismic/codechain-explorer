import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import { Popover, PopoverBody } from "reactstrap";
import * as CopyToClipboard from "react-copy-to-clipboard";
import "./CopyButton.scss";

interface Props {
    copyString: string;
    className?: string;
}

interface State {
    copyPopoverOpen: boolean;
}

class CopyButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            copyPopoverOpen: false
        };
    }

    public render() {
        const { copyString, className } = this.props;
        const { copyPopoverOpen } = this.state;
        return (
            <div className={`copy-button ${className}`} >
                <CopyToClipboard text={copyString} onCopy={this.toggleCopyPopover}>
                    <button className="btn btn-primary copy" id="asset-copy"><FontAwesome name="copy" /></button>
                </CopyToClipboard>
                <Popover placement="top" isOpen={copyPopoverOpen} target="asset-copy" toggle={this.toggleCopyPopover}>
                    <PopoverBody>Copied to clipboard</PopoverBody>
                </Popover>
            </div>
        );
    }

    private toggleCopyPopover = () => {
        this.setState({
            copyPopoverOpen: !this.state.copyPopoverOpen
        });
    }
}

export default CopyButton;