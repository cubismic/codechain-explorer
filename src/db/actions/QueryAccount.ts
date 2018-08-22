import * as _ from "lodash";
import { Client } from "elasticsearch";
import { BaseAction } from "./BaseAction";
import { ElasticSearchAgent } from "../ElasticSearchAgent";
import { BigNumber } from "bignumber.js";

export interface Account {
    address: string,
    balance: string
}

interface AccountData {
    balance: string;
}

export class QueryAccount implements BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;

    public async increaseBalance(address: string, balance: string): Promise<void> {
        const account = await this.getAccount(address);
        if (account) {
            await this.updateAccount(account.address, new BigNumber(account.balance).plus(new BigNumber(balance)).toString(10));
        } else {
            await this.indexAccount(address, balance);
        }
    }

    public async decreaseBalance(address: string, balance: string): Promise<void> {
        const account = await this.getAccount(address);
        if (account) {
            await this.updateAccount(account.address, new BigNumber(account.balance).minus(new BigNumber(balance)).toString(10));
        } else {
            throw new Error(`Invalid decreasing balance action => ${address}`);
        }
    }

    public async indexAccount(address: string, balance: string): Promise<any> {
        return this.client.index({
            "index": "account",
            "type": "_doc",
            "id": address,
            "body": {
                "balance": balance,
            },
            "refresh": "wait_for"
        });
    }

    public async updateAccount(address: string, balance: string): Promise<void> {
        return this.client.update({
            "index": "account",
            "type": "_doc",
            "id": address,
            "body": {
                "doc": {
                    balance
                }
            },
            "refresh": "wait_for"
        });
    }

    public async getAccount(address: string): Promise<Account | null> {
        const response = await this.client.search<AccountData>({
            "index": "account",
            "type": "_doc",
            "body": {
                "size": 1,
                "query": {
                    "term": {
                        "_id": address
                    }
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        return {
            balance: response.hits.hits[0]._source.balance,
            address
        }
    }
}
