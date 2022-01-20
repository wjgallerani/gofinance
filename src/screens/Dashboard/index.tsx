import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from 'styled-components'

import { HighligthCard } from "../../components/HighligthCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighligthCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighligthProps {
    amount: string;
    lastTransactions: string;
}
interface HighligthData {
    entries: HighligthProps,
    expensives: HighligthProps,
    total: HighligthProps
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTansactions] = useState<DataListProps[]>([]);
    const [highligthData, setHighligthData] = useState<HighligthData>({} as HighligthData);

    const theme = useTheme();

    // Funções
    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative') {

        const lastTransaciton = new Date(
            Math.max.apply(
                Math, collection
                    .filter((transaction) => transaction.type === type)
                    .map((transaction) => new Date(transaction.date).getTime())
            )
        );

        return `${lastTransaciton.getDate()} de ${lastTransaciton.toLocaleString('pt-BR', { month: 'long' })} de ${lastTransaciton.toLocaleString('pt-BR', { year: '2-digit' })}  `;
    }

    async function loadTransaction() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {

                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                const amount = Number(item.amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            });

        setTansactions(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
        const totalInterval = `01 à ${lastTransactionExpensives}`;

        const total = entriesTotal - expensiveTotal;
        setHighligthData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransactions: `Última entraga: Dia ${lastTransactionEntries}`
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransactions: `Última saída: Dia ${lastTransactionExpensives}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransactions: totalInterval
            }
        });

        setIsLoading(false);
    }

    //
    useEffect(() => {
        loadTransaction();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransaction();
    }, []));

    return (
        <Container>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadContainer> :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/25794349?v=4' }} />
                                    <User>
                                        <UserGreeting>Olá,</UserGreeting>
                                        <UserName>William</UserName>

                                    </User>
                                </UserInfo>

                                <LogoutButton onPress={() => { }}>
                                    <Icon name="power" />
                                </LogoutButton>
                            </UserWrapper>
                        </Header>

                        <HighligthCards>
                            <HighligthCard
                                type="up"
                                title="Entradas"
                                amount={highligthData.entries.amount}
                                lastTransaction={highligthData.entries.lastTransactions}

                            />

                            <HighligthCard
                                type="down"
                                title="Saída"
                                amount={highligthData.expensives.amount}
                                lastTransaction={highligthData.expensives.lastTransactions}
                            />

                            <HighligthCard
                                type="total"
                                title="Total"
                                amount={highligthData.total.amount}
                                lastTransaction={highligthData.total.lastTransactions}
                            />
                        </HighligthCards>

                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />
                        </Transactions>
                    </>
            }
        </Container>
    );
}