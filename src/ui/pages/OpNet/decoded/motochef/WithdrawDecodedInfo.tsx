import { Card, Column, Text } from '@/ui/components';
import { Decoded } from '@/ui/pages/OpNet/decoded/DecodedTypes';
import { Address, BinaryReader } from '@btc-vision/transaction';
import { sliceAddress } from '../helpper';

export function decodeWithdrawMotoChef(selector: string, reader: BinaryReader): WithdrawDecoded {
    const poolId: bigint = reader.readU64();
    const amount: bigint = reader.readU256();
    const to: Address = reader.readAddress();

    return {
        selector,
        poolId,
        amount,
        to
    };
}

export interface WithdrawDecoded extends Decoded {
    readonly poolId: bigint;
    readonly amount: bigint;
    readonly to: Address;
}

interface WithdrawProps {
    readonly decoded: WithdrawDecoded;
    readonly interactionType: string;
}

export function WithdrawDecodedInfo(props: WithdrawProps) {
    const interactionType = props.interactionType;
    const decoded = props.decoded;

    const slicedToAddress = sliceAddress(decoded.to.toHex());

    return (
        <Card>
            <Column>
                <Text
                    text={interactionType}
                    preset="sub"
                    textCenter
                    style={{ maxWidth: 300, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                />
                <Text text={`Pool ID: ${decoded.poolId}`} preset="sub" textCenter />
                <Text text={`Amount: ${decoded.amount}`} preset="sub" textCenter />

                <Text text={`To: ➜ ${slicedToAddress}`} preset="sub" textCenter />
            </Column>
        </Card>
    );
}
