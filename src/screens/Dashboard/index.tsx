import React from "react";

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
    TransactionList
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {

    //const data: DataListProps[] = [
    const data: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: "Salário",
            amount: " R$ 1.000,00",
            category: {
                name: 'Venda',
                icon: 'dollar-sign'
            },
            date: "01/01/2021"
        },
        {
            id: '2',
            type: 'negative',
            title: "Café",
            amount: "R$ 10,00",
            category: {
                name: 'Compra',
                icon: 'coffe'
            },
            date: "01/01/2021"
        },
        {
            id: '3',
            type: 'negative',
            title: "Almoço",
            amount: "R$ 30,00",
            category: {
                name: 'Compra',
                icon: 'coffe'
            },
            date: "01/01/2021"
        }
    ];

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/25794349?v=4' }} />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>William</UserName>

                        </User>
                    </UserInfo>

                    <Icon name="power" />
                </UserWrapper>
            </Header>

            <HighligthCards>
                <HighligthCard
                    title="Entradas"
                    amount="17"
                    lastTransaction="Teste"
                    type="up"
                />

                <HighligthCard
                    title="Saída"
                    amount="2"
                    lastTransaction="Teste"
                    type="down"
                />

                <HighligthCard
                    title="Total"
                    amount="15"
                    lastTransaction="Teste"
                    type="total"
                />
            </HighligthCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>
        </Container>
    );
}