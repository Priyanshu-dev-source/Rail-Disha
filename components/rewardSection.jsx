"use client"

import {
    Roboto_100Thin,
    Roboto_400Regular,
    Roboto_700Bold,
    useFonts,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';

const RewardsSection = () => {
    const [fontsLoaded] = useFonts({
        Roboto_700Bold,
        Roboto_400Regular,
        Roboto_100Thin,
    });
    const [activeTab, setActiveTab] = useState('Collect Rewards');
    const [userName, setUserName] = useState('Buddy');
    const [totalPoints, setTotalPoints] = useState(0);
    const [currentStatus, setCurrentStatus] = useState([]);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [rewardsList, setRewardsList] = useState([
        {
            id: 1,
            title: 'Platform Guide',
            description: 'Share correct platform location & earn 100 points',
            icon: '🚉',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 100,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 2,
            title: 'Train Status',
            description: 'Report real-time train status for 150 points',
            icon: '🚂',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 150,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 3,
            title: 'Help Navigator',
            description: 'Guide 5 passengers to earn 300 points',
            icon: '🧭',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 300,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 4,
            title: 'Station Expert',
            description: 'Share station facilities & earn 200 points',
            icon: '🏢',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 200,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 5,
            title: 'Route Master',
            description: 'Share alternative routes & earn 250 points',
            icon: '🗺️',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 250,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 6,
            title: 'Safety Alert',
            description: 'Report safety concerns for 400 points',
            icon: '⚠️',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 400,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 7,
            title: 'Food Guide',
            description: 'Share food vendor locations for 150 points',
            icon: '🍽️',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 150,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 8,
            title: 'Accessibility Helper',
            description: 'Guide disabled passengers for 350 points',
            icon: '♿',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 350,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 9,
            title: 'Lost & Found',
            description: 'Help locate lost items for 300 points',
            icon: '🔍',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 300,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 10,
            title: 'Quick Response',
            description: 'Fast assistance to queries for 200 points',
            icon: '⚡',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 200,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 11,
            title: 'Delay Reporter',
            description: 'Report accurate train delays for 175 points',
            icon: '⏰',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 175,
            redeemed: false,
            redeemedDate: null
        },
        {
            id: 12,
            title: 'Ticket Counter Guide',
            description: 'Help with ticket counter locations for 125 points',
            icon: '🎫',
            buttonText: 'Collect Reward',
            buttonColor: '#FFB700',
            points: 125,
            redeemed: false,
            redeemedDate: null
        }
    ]);

    const handleCollectReward = (id) => {
        const reward = rewardsList.find(r => r.id === id);
        if (reward) {
            // Update the reward status
            setRewardsList(prevRewards => 
                prevRewards.map(r => 
                    r.id === id 
                        ? {
                            ...r,
                            redeemed: true,
                            redeemedDate: new Date().toISOString().split('T')[0],
                            buttonColor: '#10B981',
                            buttonText: 'Redeemed'
                        }
                        : r
                )
            );

            // Update total points
            setTotalPoints(prev => prev + reward.points);

            // Add to current status with timestamp
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            setCurrentStatus(prev => [
                {
                    id: now.getTime(),
                    points: reward.points,
                    title: reward.title,
                    time: timeString
                },
                ...prev
            ]);
        }
    };

    // Filter rewards based on active tab
    const filteredRewards = rewardsList.filter(reward => 
        activeTab === 'Collect Rewards' ? !reward.redeemed : reward.redeemed
    );

    const tabs = ['Collect Rewards', 'Redeem Rewards'];

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const { name } = JSON.parse(userData);
                    setUserName(name);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();
    }, []);

    const handleReset = () => {
        setRewardsList(prevRewards =>
            prevRewards.map(reward => ({
                ...reward,
                redeemed: false,
                redeemedDate: null,
                buttonColor: '#FFB700',
                buttonText: 'Collect Reward'
            }))
        );
        setTotalPoints(0);
        setCurrentStatus([]);
        setShowResetModal(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={require('../assets/images/userAvatar.png')}
                            style={styles.avatar}
                            resizeMode="contain"
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>Hey</Text>
                            <Text style={styles.userName}>{userName}</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity 
                            style={styles.resetButton}
                            onPress={() => setShowResetModal(true)}
                        >
                            <Ionicons name="refresh" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.infoButton}
                            onPress={() => setShowInfoModal(true)}
                        >
                            <Ionicons name="information-circle-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Reset Confirmation Modal */}
                <Modal
                    isVisible={showResetModal}
                    onBackdropPress={() => setShowResetModal(false)}
                    style={styles.modalView}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Reset All Rewards?</Text>
                        </View>
                        <Text style={styles.modalText}>
                            This will move all rewards back to collect section and reset your points. 
                            This action cannot be undone.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowResetModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.resetConfirmButton]}
                                onPress={handleReset}
                            >
                                <Text style={styles.resetButtonText}>Reset All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Total Rewards */}
                <View style={styles.totalRewards}>
                    <Text style={styles.totalRewardsTitle}>Total Rewards Earned</Text>
                    <View style={styles.totalAmount}>
                        <Text style={styles.amount}>{totalPoints} Points</Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>My Goals</Text>
                        <Text style={styles.statValue}>12500 Points</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Current Status</Text>
                        {currentStatus.length > 0 ? (
                            <>
                                <Text style={styles.statValuePositive}>
                                    +{currentStatus[0].points} Points
                                </Text>
                                <Text style={styles.timeText}>
                                    {currentStatus[0].time}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.statValue}>No rewards yet</Text>
                        )}
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Withdrawals</Text>
                        <Text style={styles.statValue}>3500 Points</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                activeTab === tab && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Reward Cards Grid */}
                <View style={styles.cardsContainer}>
                    {filteredRewards.map((card) => (
                        <View key={card.id} style={styles.cardWrapper}>
                            <View style={styles.card}>
                                <View style={styles.cardIcon}>
                                    <Text style={styles.iconText}>{card.icon}</Text>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{card.title}</Text>
                                    <Text style={styles.cardDescription}>
                                        {card.redeemed 
                                            ? `Redeemed on ${card.redeemedDate}` 
                                            : card.description
                                        }
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.cardButton, { backgroundColor: card.buttonColor }]}
                                    onPress={() => !card.redeemed && handleCollectReward(card.id)}
                                    disabled={card.redeemed}
                                >
                                    <Text style={styles.cardButtonText}>
                                        {card.buttonText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7C3AED',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: 12,
    },
    greeting: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto_400Regular',
        opacity: 0.8,
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Roboto_700Bold',
        marginTop: 2,
    },
    headerRight: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        padding: 5,
    },
    infoIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    totalRewards: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    totalRewardsTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 8,
        fontFamily: 'Roboto_400Regular',
    },
    totalAmount: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amount: {
        color: '#FFFFFF',
        fontSize: 32,
        marginRight: 8,
        fontFamily: 'Roboto_700Bold',
    },
    upArrow: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        color: '#E5E7EB',
        fontSize: 12,
        marginBottom: 4,
        fontFamily: 'Roboto_400Regular',
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto_700Bold',
    },
    statValuePositive: {
        color: '#10B981',
        fontSize: 14,
        fontFamily: 'Roboto_700Bold',
    },
    percentagePositive: {
        color: '#10B981',
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'Roboto_400Regular',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#FFFFFF',
    },
    tabText: {
        color: '#E5E7EB',
        fontSize: 14,
        fontFamily: 'Roboto_400Regular',
    },
    activeTabText: {
        color: '#FFFFFF',
        fontFamily: 'Roboto_700Bold',
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        paddingBottom: 70,
    },
    cardWrapper: {
        width: '48%',
        marginBottom: 15,
        marginRight: '2%',
        height: 220,
    },
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'space-between',
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#374151',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconText: {
        fontSize: 24,
    },
    cardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: 'Roboto_700Bold',
    },
    cardDescription: {
        color: '#9CA3AF',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 16,
        fontFamily: 'Roboto_400Regular',
    },
    cardButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    cardButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Roboto_700Bold',
    },
    timeText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
        fontFamily: 'Roboto_400Regular',
    },
    resetButton: {
        padding: 5,
    },
    infoButton: {
        padding: 5,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalHeader: {
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Roboto_700Bold',
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Roboto_400Regular',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: '#FFB700',
        flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#E5E7EB',
    },
    resetConfirmButton: {
        backgroundColor: '#10B981',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto_700Bold',
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto_700Bold',
    },
});

export default RewardsSection;