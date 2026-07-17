<template>
    <div class="mortgage-calculator">
        <div class="content">
            <nya-container title="房贷计算器">
                <div class="tool-info mb-15">
                    <p>输入贷款信息，快速计算月供、总利息和还款明细。支持商业贷款、公积金贷款和组合贷款。</p>
                </div>

                <div class="radio-group mb-15">
                    <div class="radio-label">贷款类型</div>
                    <div class="radio-options">
                        <label class="radio-option" :class="{ active: loanType === 'commercial' }">
                            <input type="radio" v-model="loanType" value="commercial" />
                            <span>商业贷款</span>
                        </label>
                        <label class="radio-option" :class="{ active: loanType === 'fund' }">
                            <input type="radio" v-model="loanType" value="fund" />
                            <span>公积金贷款</span>
                        </label>
                        <label class="radio-option" :class="{ active: loanType === 'combo' }">
                            <input type="radio" v-model="loanType" value="combo" />
                            <span>组合贷款</span>
                        </label>
                    </div>
                </div>

                <nya-input
                    v-model="totalAmount"
                    class="mb-15"
                    fullwidth
                    type="number"
                    label="贷款金额（万元）"
                    placeholder="请输入贷款金额"
                />

                <div v-if="loanType === 'combo'" class="combo-fields">
                    <nya-input
                        v-model="commercialAmount"
                        class="mb-15"
                        fullwidth
                        type="number"
                        label="商业贷款金额（万元）"
                        placeholder="请输入商业贷款金额"
                    />
                    <nya-input
                        v-model="fundAmount"
                        class="mb-15"
                        fullwidth
                        type="number"
                        label="公积金贷款金额（万元）"
                        placeholder="请输入公积金贷款金额"
                    />
                </div>

                <nya-input
                    v-model="loanYears"
                    class="mb-15"
                    fullwidth
                    type="number"
                    label="贷款年限（年）"
                    placeholder="请输入贷款年限"
                />

                <nya-input
                    v-model="commercialRate"
                    class="mb-15"
                    fullwidth
                    type="number"
                    :label="loanType === 'commercial' ? '年利率（%）' : '商业贷款利率（%）'"
                    placeholder="请输入商业贷款利率"
                />

                <nya-input
                    v-if="loanType === 'fund' || loanType === 'combo'"
                    v-model="fundRate"
                    class="mb-15"
                    fullwidth
                    type="number"
                    label="公积金贷款利率（%）"
                    placeholder="请输入公积金贷款利率"
                />

                <div class="radio-group mb-15">
                    <div class="radio-label">还款方式</div>
                    <div class="radio-options">
                        <label class="radio-option" :class="{ active: repaymentType === 'equal-payment' }">
                            <input type="radio" v-model="repaymentType" value="equal-payment" />
                            <span>等额本息</span>
                        </label>
                        <label class="radio-option" :class="{ active: repaymentType === 'equal-principal' }">
                            <input type="radio" v-model="repaymentType" value="equal-principal" />
                            <span>等额本金</span>
                        </label>
                    </div>
                </div>

                <div class="btn-group">
                    <button type="button" class="btn-primary" @click="calculate">
                        📊 开始计算
                    </button>
                    <button type="button" class="btn-info" @click="reset">
                        🔄 重置
                    </button>
                </div>
            </nya-container>

            <nya-container v-if="calculated" title="计算结果" class="mb-15">
                <div class="result-grid">
                    <div class="result-item">
                        <div class="result-label">贷款类型</div>
                        <div class="result-value">{{ loanTypeLabels[loanType] }}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">贷款金额</div>
                        <div class="result-value">{{ formatMoney(totalAmount * 10000) }}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">贷款年限</div>
                        <div class="result-value">{{ loanYears }}年（{{ loanYears * 12 }}期）</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">还款方式</div>
                        <div class="result-value">{{ repaymentTypeLabels[repaymentType] }}</div>
                    </div>
                </div>

                <div v-if="loanType === 'combo'" class="combo-result">
                    <div class="combo-row">
                        <span class="combo-label">商业贷款：</span>
                        <span class="combo-value">{{ formatMoney(commercialAmount * 10000) }}</span>
                        <span class="combo-rate">利率 {{ commercialRate }}%</span>
                    </div>
                    <div class="combo-row">
                        <span class="combo-label">公积金贷款：</span>
                        <span class="combo-value">{{ formatMoney(fundAmount * 10000) }}</span>
                        <span class="combo-rate">利率 {{ fundRate }}%</span>
                    </div>
                </div>

                <div class="summary-section">
                    <div class="summary-item">
                        <div class="summary-label">月供</div>
                        <div class="summary-value">{{ formatMoney(monthlyPayment) }}</div>
                        <div v-if="loanType === 'combo'" class="summary-breakdown">
                            <span>商业 {{ formatMoney(commercialMonthlyPayment) }} + 公积金 {{ formatMoney(fundMonthlyPayment) }}</span>
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">总利息</div>
                        <div class="summary-value highlight">{{ formatMoney(totalInterest) }}</div>
                        <div v-if="loanType === 'combo'" class="summary-breakdown">
                            <span>商业 {{ formatMoney(commercialTotalInterest) }} + 公积金 {{ formatMoney(fundTotalInterest) }}</span>
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">还款总额</div>
                        <div class="summary-value">{{ formatMoney(totalPayment) }}</div>
                    </div>
                </div>
            </nya-container>

            <nya-container v-if="calculated" title="还款明细" class="mb-15">
                <div class="detail-table">
                    <table>
                        <thead>
                            <tr>
                                <th>期数</th>
                                <th>月供</th>
                                <th v-if="loanType === 'combo'">商贷月供</th>
                                <th v-if="loanType === 'combo'">公积金月供</th>
                                <th>本金</th>
                                <th>利息</th>
                                <th>剩余本金</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>第1期</td>
                                <td>{{ formatMoney(schedule[0].payment) }}</td>
                                <td v-if="loanType === 'combo'">{{ formatMoney(schedule[0].commercialPayment) }}</td>
                                <td v-if="loanType === 'combo'">{{ formatMoney(schedule[0].fundPayment) }}</td>
                                <td>{{ formatMoney(schedule[0].principal) }}</td>
                                <td>{{ formatMoney(schedule[0].interest) }}</td>
                                <td>{{ formatMoney(schedule[0].remaining) }}</td>
                            </tr>
                            <tr>
                                <td>第2期</td>
                                <td>{{ formatMoney(schedule[1].payment) }}</td>
                                <td v-if="loanType === 'combo'">{{ formatMoney(schedule[1].commercialPayment) }}</td>
                                <td v-if="loanType === 'combo'">{{ formatMoney(schedule[1].fundPayment) }}</td>
                                <td>{{ formatMoney(schedule[1].principal) }}</td>
                                <td>{{ formatMoney(schedule[1].interest) }}</td>
                                <td>{{ formatMoney(schedule[1].remaining) }}</td>
                            </tr>
                            <tr>
                                <td>...</td>
                                <td>...</td>
                                <td v-if="loanType === 'combo'">...</td>
                                <td v-if="loanType === 'combo'">...</td>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                            </tr>
                            <tr>
                                <td>最后一期</td>
                                <td>{{ formatMoney(schedule[schedule.length - 1].payment) }}</td>
                                <td v-if="loanType === 'combo'">{{ formatMoney(schedule[schedule.length - 1].commercialPayment) }}</td>
                                <td v-if="loanType === 'combo'">{{ formatMoney(schedule[schedule.length - 1].fundPayment) }}</td>
                                <td>{{ formatMoney(schedule[schedule.length - 1].principal) }}</td>
                                <td>{{ formatMoney(schedule[schedule.length - 1].interest) }}</td>
                                <td>{{ formatMoney(schedule[schedule.length - 1].remaining) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="detail-note">注：以上仅展示首月、次月和最后一期数据。{{ repaymentType === 'equal-principal' ? '等额本金还款方式每月月供递减。' : '' }}</p>
            </nya-container>

            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>贷款类型说明：</h4>
                    <ul>
                        <li><strong>商业贷款：</strong>利率相对较高，还款期限灵活，适合没有公积金或公积金贷款额度不足的购房者。</li>
                        <li><strong>公积金贷款：</strong>利率较低，还款压力较小，但贷款额度有上限，且审批流程相对严格。</li>
                        <li><strong>组合贷款：</strong>同时使用商业贷款和公积金贷款，充分利用公积金的低利率优势，又能满足较高的贷款需求。</li>
                    </ul>

                    <h4>还款方式说明：</h4>
                    <ul>
                        <li><strong>等额本息：</strong>每月还款金额相同，前期还款中利息占比较大，本金占比较小；后期本金占比逐渐增大，利息占比逐渐减小。适合收入稳定、不打算提前还款的购房者。</li>
                        <li><strong>等额本金：</strong>每月还款本金相同，月供逐月递减，总利息较等额本息少。适合前期还款能力较强、打算提前还款的购房者。</li>
                    </ul>

                    <h4>计算公式：</h4>
                    <ul>
                        <li><strong>等额本息月供</strong> = 贷款本金 × 月利率 × (1+月利率)^还款月数 ÷ [(1+月利率)^还款月数 - 1]</li>
                        <li><strong>等额本金月供</strong> = 贷款本金 ÷ 还款月数 + (贷款本金 - 已归还本金累计额) × 月利率</li>
                    </ul>
                </div>
            </nya-container>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MortgageCalculator',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            loanType: 'commercial',
            loanTypeLabels: {
                commercial: '商业贷款',
                fund: '公积金贷款',
                combo: '组合贷款'
            },
            totalAmount: '',
            commercialAmount: '',
            fundAmount: '',
            loanYears: '',
            commercialRate: '',
            fundRate: '',
            repaymentType: 'equal-payment',
            repaymentTypeLabels: {
                'equal-payment': '等额本息',
                'equal-principal': '等额本金'
            },
            calculated: false,
            monthlyPayment: 0,
            commercialMonthlyPayment: 0,
            fundMonthlyPayment: 0,
            totalInterest: 0,
            commercialTotalInterest: 0,
            fundTotalInterest: 0,
            totalPayment: 0,
            schedule: []
        };
    },
    methods: {
        calculate() {
            const years = parseInt(this.loanYears);
            if (!years || years <= 0) {
                this.$noty.error('请输入有效的贷款年限');
                return;
            }

            const months = years * 12;
            let commercialAmount = 0;
            let fundAmount = 0;

            if (this.loanType === 'combo') {
                commercialAmount = parseFloat(this.commercialAmount) * 10000;
                fundAmount = parseFloat(this.fundAmount) * 10000;
                
                if (!commercialAmount || !fundAmount || commercialAmount <= 0 || fundAmount <= 0) {
                    this.$noty.error('请输入有效的商业贷款和公积金贷款金额');
                    return;
                }
                
                this.totalAmount = (commercialAmount + fundAmount) / 10000;
            } else {
                this.totalAmount = parseFloat(this.totalAmount);
                if (!this.totalAmount || this.totalAmount <= 0) {
                    this.$noty.error('请输入有效的贷款金额');
                    return;
                }
                
                if (this.loanType === 'commercial') {
                    commercialAmount = this.totalAmount * 10000;
                } else {
                    fundAmount = this.totalAmount * 10000;
                }
            }

            const commercialRate = parseFloat(this.commercialRate) / 100;
            const fundRate = parseFloat(this.fundRate) / 100;

            if ((commercialAmount > 0 && (!commercialRate || commercialRate <= 0)) ||
                (fundAmount > 0 && (!fundRate || fundRate <= 0))) {
                this.$noty.error('请输入有效的利率');
                return;
            }

            let commercialResult = { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, schedule: [] };
            let fundResult = { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, schedule: [] };

            if (commercialAmount > 0) {
                commercialResult = this.calculateLoan(
                    commercialAmount, months, commercialRate / 12
                );
            }

            if (fundAmount > 0) {
                fundResult = this.calculateLoan(
                    fundAmount, months, fundRate / 12
                );
            }

            this.monthlyPayment = commercialResult.monthlyPayment + fundResult.monthlyPayment;
            this.commercialMonthlyPayment = commercialResult.monthlyPayment;
            this.fundMonthlyPayment = fundResult.monthlyPayment;
            this.totalInterest = commercialResult.totalInterest + fundResult.totalInterest;
            this.commercialTotalInterest = commercialResult.totalInterest;
            this.fundTotalInterest = fundResult.totalInterest;
            this.totalPayment = commercialResult.totalPayment + fundResult.totalPayment;
            
            this.schedule = [];
            for (let i = 0; i < months; i++) {
                const c = commercialResult.schedule[i] || { payment: commercialResult.monthlyPayment, principal: 0, interest: 0, remaining: 0 };
                const f = fundResult.schedule[i] || { payment: fundResult.monthlyPayment, principal: 0, interest: 0, remaining: 0 };
                this.schedule.push({
                    payment: c.payment + f.payment,
                    commercialPayment: c.payment,
                    fundPayment: f.payment,
                    principal: c.principal + f.principal,
                    interest: c.interest + f.interest,
                    remaining: c.remaining + f.remaining
                });
            }

            this.calculated = true;
            this.$noty.success('计算完成');
        },

        calculateLoan(amount, months, monthlyRate) {
            if (this.repaymentType === 'equal-payment') {
                const pow = Math.pow(1 + monthlyRate, months);
                const monthlyPayment = amount * monthlyRate * pow / (pow - 1);
                const totalPayment = monthlyPayment * months;
                const totalInterest = totalPayment - amount;
                const schedule = [];
                for (let i = 0; i < months; i++) {
                    const interest = (amount - (amount / months) * i) * monthlyRate;
                    const principal = monthlyPayment - interest;
                    schedule.push({
                        payment: monthlyPayment,
                        principal,
                        interest,
                        remaining: Math.max(0, amount - (amount / months) * (i + 1))
                    });
                }
                return { monthlyPayment, totalInterest, totalPayment, schedule };
            } else {
                const principalPerMonth = amount / months;
                const schedule = [];
                let totalInterest = 0;
                let remaining = amount;

                for (let i = 0; i < months; i++) {
                    const interest = remaining * monthlyRate;
                    const payment = principalPerMonth + interest;
                    remaining -= principalPerMonth;
                    totalInterest += interest;

                    schedule.push({
                        payment,
                        principal: principalPerMonth,
                        interest,
                        remaining: Math.max(0, remaining)
                    });
                }

                return {
                    monthlyPayment: schedule[0].payment,
                    totalInterest,
                    totalPayment: amount + totalInterest,
                    schedule
                };
            }
        },

        reset() {
            this.loanType = 'commercial';
            this.totalAmount = '';
            this.commercialAmount = '';
            this.fundAmount = '';
            this.loanYears = '';
            this.commercialRate = '';
            this.fundRate = '';
            this.repaymentType = 'equal-payment';
            this.calculated = false;
            this.monthlyPayment = 0;
            this.commercialMonthlyPayment = 0;
            this.fundMonthlyPayment = 0;
            this.totalInterest = 0;
            this.commercialTotalInterest = 0;
            this.fundTotalInterest = 0;
            this.totalPayment = 0;
            this.schedule = [];
        },

        formatMoney(value) {
            return '¥' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
};
</script>

<style lang="scss" scoped>
.mortgage-calculator {
    .content {
        min-width: 0;
    }

    .radio-group {
        margin-bottom: 15px;

        .radio-label {
            font-size: 14px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .radio-options {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .radio-option {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            border: 1px solid #e8e8e8;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.2s;

            input {
                display: none;
            }

            span {
                font-size: 14px;
                color: #666;
            }

            &:hover {
                border-color: var(--theme);
                color: var(--theme);
            }

            &.active {
                background: var(--theme);
                border-color: var(--theme);

                span {
                    color: #fff;
                }
            }
        }
    }

    .combo-fields {
        background: var(--bg-color);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .result-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 20px;

        .result-item {
            background: var(--bg-color);
            padding: 15px;
            border-radius: 8px;

            .result-label {
                font-size: 12px;
                color: #999;
                margin-bottom: 5px;
            }

            .result-value {
                font-size: 16px;
                font-weight: 600;
                color: var(--primary-color);
            }
        }
    }

    .combo-result {
        background: var(--bg-color);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;

        .combo-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            &:last-child {
                margin-bottom: 0;
            }

            .combo-label {
                font-size: 14px;
                color: #666;
                width: 120px;
            }

            .combo-value {
                font-size: 16px;
                font-weight: 600;
                color: var(--primary-color);
                flex: 1;
            }

            .combo-rate {
                font-size: 14px;
                color: #999;
            }
        }
    }

    .summary-section {
        display: flex;
        justify-content: space-around;
        background: var(--theme);
        padding: 20px;
        border-radius: 8px;

        .summary-item {
            text-align: center;

            .summary-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 8px;
            }

            .summary-value {
                font-size: 20px;
                font-weight: 600;
                color: #fff;

                &.highlight {
                    font-size: 24px;
                }
            }

            .summary-breakdown {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                margin-top: 5px;
            }
        }
    }

    .detail-table {
        overflow-x: auto;
        margin-bottom: 15px;

        table {
            width: 100%;
            border-collapse: collapse;

            th, td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid var(--border-color);
            }

            th {
                background: var(--bg-color);
                font-weight: 600;
                font-size: 13px;
            }

            td {
                font-size: 13px;
            }
        }
    }

    .detail-note {
        font-size: 12px;
        color: #999;
        margin: 0;
    }

    .instructions {
        h4 {
            color: var(--primary-color);
            margin: 15px 0 10px 0;
        }

        p {
            margin: 0 0 10px 0;
            line-height: 1.6;
        }

        ul {
            margin: 0;
            padding-left: 20px;

            li {
                margin-bottom: 8px;
                line-height: 1.6;
            }
        }
    }
}

body.dark .mortgage-calculator {
    .radio-group {
        .radio-option {
            border-color: #2a2a3a;

            span {
                color: #aaa;
            }

            &:hover {
                border-color: var(--theme);
            }
        }
    }

    .combo-fields,
    .result-grid .result-item,
    .combo-result {
        background: #1a1a2a;

        .result-label,
        .combo-label {
            color: #666;
        }
    }

    .detail-table table {
        th {
            background: #1a1a2a;
            border-bottom-color: #2a2a3a;
        }

        td {
            border-bottom-color: #2a2a3a;
        }
    }
}
</style>