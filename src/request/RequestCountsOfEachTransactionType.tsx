import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { apiRequest } from "./ApiRequest";

interface OwnProps {
    blockNumber: number;
    onTxCounts: (c: any) => void;
    onError: (e: any) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}
type Props = OwnProps & DispatchProps;
class RequestCountsOfEachTransactionType extends React.Component<Props> {
    public componentWillMount() {
        const { dispatch, onError, onTxCounts, blockNumber } = this.props;

        apiRequest({
            path: `aggs-tx/count?blockNumber=${blockNumber}`,
            dispatch,
            showProgressBar: true
        })
            .then((response: { type: string; count: number }[]) => {
                console.log(response);
                onTxCounts(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestCountsOfEachTransactionType);
