import { useEffect, useState } from 'react';

import { AddressFlagType, AUTO_LOCKTIMES, DEFAULT_LOCKTIME_ID } from '@/shared/constant';
import { checkAddressFlag } from '@/shared/utils';
import { Card, Column, Content, Header, Icon, Layout, Row, Text } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { Loading } from '@/ui/components/ActionComponent/Loading';
import { EnableUnconfirmedPopover } from '@/ui/components/EnableUnconfirmedPopover';
import { Popover } from '@/ui/components/Popover';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { accountActions } from '@/ui/state/accounts/reducer';
import { useAppDispatch } from '@/ui/state/hooks';
import { useAutoLockTimeId } from '@/ui/state/settings/hooks';
import { settingsActions } from '@/ui/state/settings/reducer';
import { colors, ColorTypes } from '@/ui/theme/colors';
import { useWallet } from '@/ui/utils';

export default function AdvancedScreen() {
    const wallet = useWallet();
    // const [enableSignData, setEnableSignData] = useState(false);

    // const [enableSignDataPopoverVisible, setEnableSignDataPopoverVisible] = useState(false);

    const [enableUnconfirmed, setEnableUnconfirmed] = useState(false);
    const [unconfirmedPopoverVisible, setUnconfirmedPopoverVisible] = useState(false);

    const [lockTimePopoverVisible, setLockTimePopoverVisible] = useState(false);
    const autoLockTimeId = useAutoLockTimeId();
    const lockTimeConfig = AUTO_LOCKTIMES[autoLockTimeId] || AUTO_LOCKTIMES[DEFAULT_LOCKTIME_ID];

    console.log('autoLockTimeId', autoLockTimeId);

    const currentAccount = useCurrentAccount();

    const dispatch = useAppDispatch();
    const [init, setInit] = useState(false);
    useEffect(() => {
        // wallet
        //     .getEnableSignData()
        //     .then((v) => {
        //         setEnableSignData(v);
        //     })
        //     .finally(() => {
        //         setInit(true);
        //     });

        setInit(true);

        const only_confirmed = checkAddressFlag(currentAccount.flag, AddressFlagType.CONFIRMED_UTXO_MODE);
        if (only_confirmed) {
            setEnableUnconfirmed(false);
        } else {
            setEnableUnconfirmed(true);
        }
    }, []);

    if (!init) {
        return <Layout></Layout>;
    }

    return (
        <Layout>
            <Header
                onBack={() => {
                    window.history.go(-1);
                }}
                title="Advanced"
            />
            <Content>
                {/* <Column>
                    <Card style={{ borderRadius: 10 }}>
                        <Column>
                            <Text text={'signData requests'} preset="bold" size="sm" />
                            <Row>
                                <Text
                                    preset="sub"
                                    size="sm"
                                    text={
                                        "If you enable this setting, you might get signature requests that aren't readable. By signing a message you don't understand, you could be agreeing to give away your funds and NFTs.You're at risk for phishing attacks. Protect yourself by turning off signData."
                                    }
                                />
                            </Row>

                            <Row style={{ borderTopWidth: 1, borderColor: colors.border }} my="md" />

                            <Row justifyBetween>
                                <Text text={'Allow signData requests'} size="xs" />

                                <Switch
                                    onChange={async () => {
                                        if (enableSignData) {
                                            await wallet.setEnableSignData(false);
                                            setEnableSignData(false);
                                        } else {
                                            setEnableSignDataPopoverVisible(true);
                                        }
                                    }}
                                    checked={enableSignData}></Switch>
                            </Row>
                        </Column>
                    </Card>
                </Column> */}

                {/* <Column>
                    <Card style={{ borderRadius: 10 }}>
                        <Column>
                            <Text text={'Setup Preferences'} preset="bold" size="sm" />
                            <Row>
                                <Text
                                    preset="sub"
                                    size="sm"
                                    text={
                                        'If you enable this setting, you will only be able to use OP_NET. This means you will not be able to use other standards such as Ordinals, Atomicals, or Runes.'
                                    }
                                />
                            </Row>

                            <Row style={{ borderTopWidth: 1, borderColor: colors.border }} my="md" />
                        </Column>
                    </Card>
                </Column> */}

                <Column>
                    <Card style={{ borderRadius: 10 }}>
                        <Row
                            onClick={() => {
                                setLockTimePopoverVisible(true);
                            }}
                            justifyCenter
                            itemsCenter
                            full>
                            <Column>
                                <Icon size={16} icon="overview"></Icon>
                            </Column>
                            <Column>
                                <Text size="sm" text={'Automatic Lock Time'} preset="bold"></Text>
                            </Column>
                            <Column style={{ marginLeft: 'auto' }}>
                                <Row justifyCenter itemsCenter>
                                    <Text size="sm" color="gold" text={lockTimeConfig.label}></Text>
                                    <Icon icon="down" size={18}></Icon>
                                </Row>
                            </Column>
                        </Row>
                    </Card>
                </Column>
            </Content>
            {unconfirmedPopoverVisible ? (
                <EnableUnconfirmedPopover
                    onClose={() => setUnconfirmedPopoverVisible(false)}
                    onConfirm={async () => {
                        let _currentAccount = currentAccount;
                        _currentAccount = await wallet.addAddressFlag(
                            _currentAccount,
                            AddressFlagType.DISABLE_AUTO_SWITCH_CONFIRMED
                        );
                        _currentAccount = await wallet.removeAddressFlag(
                            _currentAccount,
                            AddressFlagType.CONFIRMED_UTXO_MODE
                        );
                        dispatch(accountActions.setCurrent(_currentAccount));
                        setEnableUnconfirmed(true);
                        setUnconfirmedPopoverVisible(false);
                    }}
                />
            ) : null}
            {/* {enableSignDataPopoverVisible ? (
                <EnableSignDataPopover
                    onNext={() => {
                        wallet.setEnableSignData(true).then(() => {
                            setEnableSignData(true);
                            setEnableSignDataPopoverVisible(false);
                        });
                    }}
                    onCancel={() => {
                        setEnableSignDataPopoverVisible(false);
                    }}
                />
            ) : null} */}

            {lockTimePopoverVisible ? (
                <LockTimePopover
                    onNext={() => {
                        setLockTimePopoverVisible(false);
                    }}
                    onCancel={() => {
                        setLockTimePopoverVisible(false);
                    }}
                />
            ) : null}
        </Layout>
    );
}

const riskColor: Record<string, ColorTypes> = {
    high: 'danger',
    low: 'orange'
};

// export const EnableSignDataPopover = ({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) => {
//     const [understand, setUnderstand] = useState(false);
//     return (
//         <Popover onClose={onCancel}>
//             <Column justifyCenter itemsCenter>
//                 <Text text={'Use at your own risk'} textCenter preset="title-bold" color="orange" />

//                 <Column mt="lg">
//                     <Column>
//                         <Row>
//                             <Text
//                                 text={
//                                     'Allowing signData requests can make you vulnerable to phishing attacks. Always review the URL and be careful when signing messages that contain code.'
//                                 }
//                             />
//                         </Row>

//                         <Row style={{ borderTopWidth: 1, borderColor: colors.border }} my="md" />

//                         <Row style={{ backgroundColor: 'darkred', padding: 5, borderRadius: 5 }}>
//                             <Row>
//                                 <Icon icon="info" size={40} color="white" />
//                                 <Text
//                                     text={"If you've been asked to turn this setting on, you might be getting scammed"}
//                                 />
//                             </Row>
//                         </Row>

//                         <Row>
//                             <Row>
//                                 <Checkbox
//                                     onChange={() => {
//                                         setUnderstand(!understand);
//                                     }}
//                                     checked={understand}></Checkbox>
//                                 <Text
//                                     text={
//                                         'I understand that I can lose all of my funds and NFTs if I enable signData requests.'
//                                     }
//                                 />
//                             </Row>
//                         </Row>
//                     </Column>
//                 </Column>

//                 <Row full mt="lg">
//                     <Button
//                         text="Cancel"
//                         full
//                         preset="default"
//                         onClick={(e) => {
//                             if (onCancel) {
//                                 onCancel();
//                             }
//                         }}
//                     />
//                     <Button
//                         text="Continue"
//                         full
//                         disabled={!understand}
//                         preset="primary"
//                         onClick={(e) => {
//                             if (onNext) {
//                                 onNext();
//                             }
//                         }}
//                     />
//                 </Row>
//             </Column>
//         </Popover>
//     );
// };

export const LockTimePopover = ({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) => {
    const [loading, setLoading] = useState(false);

    const autoLockTimeId = useAutoLockTimeId();
    const dispatch = useAppDispatch();
    const wallet = useWallet();
    const tools = useTools();
    return (
        <Popover onClose={onCancel}>
            <Column>
                {AUTO_LOCKTIMES.map((v, i) => {
                    const check = v.id === autoLockTimeId;
                    return (
                        <Card
                            key={i}
                            mb="sm"
                            preset="style1"
                            style={{
                                height: 50,
                                minHeight: 50,
                                backgroundColor: 'rgba(255,255,255,0.01)',
                                borderBottomColor: colors.transparent,
                                borderBottomWidth: 0.2
                            }}>
                            <Row
                                onClick={async () => {
                                    const lockTimeId = v.id;
                                    await wallet.setAutoLockTimeId(lockTimeId);
                                    dispatch(settingsActions.updateSettings({ autoLockTimeId: lockTimeId }));
                                    tools.toastSuccess(`The auto-lock time has been changed to ${v.label}`);
                                    onNext();
                                }}
                                itemsCenter
                                full>
                                <Column>
                                    <Text color={check ? 'white' : 'textDim'} size="sm" text={v.label}></Text>
                                </Column>
                                <Column style={{ marginLeft: 'auto' }}>
                                    {check && !loading && <Icon icon="check"></Icon>}
                                    {check && loading && <Loading />}
                                </Column>
                            </Row>
                        </Card>
                    );
                })}
                <Row></Row>
            </Column>
        </Popover>
    );
};
