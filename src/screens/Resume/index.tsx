import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";

import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month
} from './styles';



interface TransactionsData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    color: string;
    total: number;
    totalFormatted: string;
    percent: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    async function loadData() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        //Transações de saída
        const expensives = responseFormatted
            .fiter((expensive: TransactionsData) => expensive.type === 'negative');

        const expensivesTotal = expensives
            .reduce((acumullator: number, expensive: TransactionsData) => {
                return acumullator + Number(expensive.amount);
            }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categotySum = 0;

            expensives.forEach((expensive: TransactionsData) => {
                if (expensive.category === category.key) {
                    categotySum += Number(expensive.amount);
                }
            });

            if (categotySum > 0) {

                const totalFormatted = categotySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const percent = ` ${(categotySum / expensivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categotySum,
                    totalFormatted,
                    percent
                });
            }
        });

        setTotalByCategories(totalByCategory);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Container>
            <Header>
                <Title>Resumo por Categoria</Title>
            </Header>

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight()

                }}
            >

                <MonthSelect>
                    <MonthSelectButton >
                        <MonthSelectIcon name="chevron-left" />
                    </MonthSelectButton>

                    <Month></Month>

                    <MonthSelectButton >
                        <MonthSelectIcon name="chevron-rigth" />
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape
                            }
                        }}
                        labelRadius={50}
                        x="percent"
                        y="total"
                    />
                </ChartContainer>


                {
                    totalByCategories.map(item => (
                        <HistoryCard
                            key={item.key}
                            title={item.name}
                            amount={item.totalFormatted}
                            color={item.color}
                        />
                    ))
                }
            </Content>
        </Container >
    )
}