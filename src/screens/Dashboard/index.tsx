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
import { useAuth } from "../../hooks/auth";

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
    const { signOut, user } = useAuth();

    // Funções
    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ) {

        const collectionFiltered = collection
            .filter(transaction => transaction.type === type);

        if (collectionFiltered.length === 0) {
            return 0;
        }

        const lastTransaciton = new Date(
            Math.max.apply(
                Math, collectionFiltered
                    .map((transaction) => new Date(transaction.date).getTime())
            )
        );

        return `${lastTransaciton.getDate()} de ${lastTransaciton.toLocaleString('pt-BR', { month: 'long' })} de ${lastTransaciton.toLocaleString('pt-BR', { year: '2-digit' })}  `;
    }

    async function loadTransaction() {
        const dataKey = `@gofinances:transactions_user:${user.id}`;
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

        const totalInterval = lastTransactionEntries === 0
            ? 'Não há transações'
            : `01 à ${lastTransactionExpensives}`;

        const total = entriesTotal - expensiveTotal;
        setHighligthData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransactions: lastTransactionEntries === 0
                    ? 'Não há transações'
                    : `Última entraga: Dia ${lastTransactionEntries}`
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransactions: lastTransactionEntries === 0
                    ? 'Não há transações'
                    : `Última saída: Dia ${lastTransactionExpensives}`
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
                                    <Photo source={{ uri: user.photo }} />
                                    <User>
                                        <UserGreeting>Olá,</UserGreeting>
                                        <UserName>{user.name}</UserName>

                                    </User>
                                </UserInfo>

                                <LogoutButton onPress={signOut}>
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