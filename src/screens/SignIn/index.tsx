import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useTheme } from "styled-components";

import { SignSocialButton } from '../../components/SignSocialButton'

import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';

export function SignIn() {
    const { signInWithGoogle, signInWithApple } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();

    async function hanleSignInWithGoogle() {
        try {
            setIsLoading(true);
            return await signInWithGoogle();
        } catch (error) {
            Alert.alert('Não foi possível conectar a conta Google.');
            setIsLoading(false);
        }
    }

    async function hanleSignInWithApple() {
        try {
            setIsLoading(true);
            return await signInWithApple();
        } catch (error) {
            Alert.alert('Não foi possível conectar a conta Apple.');
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples {'\n'}
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignSocialButton
                        title="Entrar com Google"
                        svg={GoogleSvg}
                        onPress={hanleSignInWithGoogle}
                    />

                    {
                        Platform.OS === 'ios' &&
                        <SignSocialButton
                            title="Entrar com Apple"
                            svg={AppleSvg}
                            onPress={hanleSignInWithApple}
                        />
                    }

                </FooterWrapper>

                {
                    isLoading &&
                    <ActivityIndicator
                        color={theme.colors.shape}
                        style={{ marginTop: 18 }}
                    />
                }
            </Footer>
        </Container>
    );
}