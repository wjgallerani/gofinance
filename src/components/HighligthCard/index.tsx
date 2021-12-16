import React from "react";

import {
    Container,
    Header,
    Title,
    Icon,
    Footer,
    Amount,
    LastTransacion
} from "./styles";

interface Props {
    title: string;
    amount: string;
    lastTransaction: string;
    type: 'up' | 'down' | 'total';
}

const icon = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
    total: 'dollar-sign'
};

export function HighligthCard({
    title,
    amount,
    lastTransaction,
    type
}: Props) {
    return (
        <Container
            type={type}
        >
            <Header>
                <Title
                    type={type}
                >{title}</Title>
                <Icon
                    name={icon[type]}
                    type={type}
                />
            </Header>

            <Footer>
                <Amount
                    type={type}
                >{amount}</Amount>
                <LastTransacion
                    type={type}
                >{lastTransaction}</LastTransacion>
            </Footer>
        </Container>
    )
}