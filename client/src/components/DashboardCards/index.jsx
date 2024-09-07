import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { db } from '../../firebase';
import { collection, getDocs } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardCards = () => {
    const [totalMembers, setTotalMembers] = useState(0);
    const [registrationTrends, setRegistrationTrends] = useState([]);
    const [thisMonthIncome, setThisMonthIncome] = useState(0);
    const [lastMonthIncome, setLastMonthIncome] = useState(0);
    const [incomeTrends, setIncomeTrends] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total members count
                const membersSnapshot = await getDocs(collection(db, "members"));
                const membersCount = membersSnapshot.size;
                setTotalMembers(membersCount);

                // Process registration dates for trend data
                const membersData = membersSnapshot.docs.map(doc => doc.data());
                const trends = membersData.reduce((acc, member) => {
                    if (member.registeredDate) {
                        const date = new Date(member.registeredDate); // Parse the registeredDate string
                        const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
                        if (!acc[monthYear]) {
                            acc[monthYear] = 0;
                        }
                        acc[monthYear]++;
                    }
                    return acc;
                }, {});

                const trendsArray = Object.keys(trends).map(key => ({
                    monthYear: key,
                    count: trends[key]
                }));

                // Sort registration trends
                trendsArray.sort((a, b) => {
                    const [aMonth, aYear] = a.monthYear.split('-').map(Number);
                    const [bMonth, bYear] = b.monthYear.split('-').map(Number);
                    return aYear - bYear || aMonth - bMonth;
                });

                setRegistrationTrends(trendsArray);

                // Fetch payments data
                const paymentsSnapshot = await getDocs(collection(db, "payments"));
                const paymentsData = paymentsSnapshot.docs.map(doc => doc.data());

                // Calculate this month's income and last month's income
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1;
                const currentYear = currentDate.getFullYear();
                const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
                const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

                let thisMonthIncome = 0;
                let lastMonthIncome = 0;
                const incomeTrends = {};

                paymentsData.forEach(payment => {
                    const paidDate = new Date(payment.paidDate);
                    const paidMonth = paidDate.getMonth() + 1;
                    const paidYear = paidDate.getFullYear();
                    const monthYear = `${paidMonth}-${paidYear}`;

                    if (!incomeTrends[monthYear]) {
                        incomeTrends[monthYear] = 0;
                    }
                    incomeTrends[monthYear] += parseFloat(payment.paidAmount);

                    if (paidMonth === currentMonth && paidYear === currentYear) {
                        thisMonthIncome += parseFloat(payment.paidAmount);
                    } else if (paidMonth === lastMonth && paidYear === lastMonthYear) {
                        lastMonthIncome += parseFloat(payment.paidAmount);
                    }
                });

                setThisMonthIncome(thisMonthIncome);
                setLastMonthIncome(lastMonthIncome);

                const incomeTrendsArray = Object.keys(incomeTrends).map(key => ({
                    monthYear: key,
                    income: incomeTrends[key]
                }));

                // Sort income trends
                incomeTrendsArray.sort((a, b) => {
                    const [aMonth, aYear] = a.monthYear.split('-').map(Number);
                    const [bMonth, bYear] = b.monthYear.split('-').map(Number);
                    return aYear - bYear || aMonth - bMonth;
                });

                setIncomeTrends(incomeTrendsArray);

            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ mt: 5, p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Total Members</Typography>
                            <Typography variant="h6">{totalMembers}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Registration Trends</Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={registrationTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="monthYear" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">This Month's Income</Typography>
                            <Typography variant="h6">Rs{thisMonthIncome}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Last Month's Income</Typography>
                            <Typography variant="h6">Rs{lastMonthIncome}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Income Trends</Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={incomeTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="monthYear" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardCards;