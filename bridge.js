var Le = Object.defineProperty, Ne = Object.defineProperties;
var Pe = Object.getOwnPropertyDescriptors;
var de = Object.getOwnPropertySymbols;
var Ve = Object.prototype.hasOwnProperty, ze = Object.prototype.propertyIsEnumerable;
var me = (e, t, n) => t in e ? Le(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, P = (e, t) => {
    for (var n in t || (t = {})) Ve.call(t, n) && me(e, n, t[n]);
    if (de) for (var n of de(t)) ze.call(t, n) && me(e, n, t[n]);
    return e
}, V = (e, t) => Ne(e, Pe(t));
import { B, J as ie, C as pe, d as D, W as ce, a as f, r as F, o as j, b as Y, c, e as o, f as y, g as s, u, h as Me, t as l, p as x, i as k, w as Ue, n as Te, j as ge, v as xe, k as ke, l as je, m as Ae, q as $, s as H, x as Ee, y as be, z as te, A as ne, D as w, E as ue, F as Ye, G as Oe, H as Ke, T as Ge, I as Je, K as Xe } from "./vendor.23f5b536.js";

const Ze = function () {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]')) i(a);
    new MutationObserver(a => { for (const p of a) if (p.type === "childList") for (const r of p.addedNodes) r.tagName === "LINK" && r.rel === "modulepreload" && i(r) }).observe(document, { childList: !0, subtree: !0 });
    function n(a) {
        const p = {};
        return a.integrity && (p.integrity = a.integrity), a.referrerpolicy && (p.referrerPolicy = a.referrerpolicy), a.crossorigin === "use-credentials" ? p.credentials = "include" : a.crossorigin === "anonymous" ? p.credentials = "omit" : p.credentials = "same-origin", p
    }
    function i(a) {
        if (a.ep) return;
        a.ep = !0;
        const p = n(a);
        fetch(a.href, p)
    }
};
Ze();

var Qe = "/assets/logout-icon.6573c741.svg";
var v = (e, t) => {
    const n = e.__vccOpts || e;
    for (const [i, a] of t) n[i] = a;
    return n
};
var h = {
    "1":
    {
        name: "eth_mainnet",
        chainId: "1",
        contracts: {
            BridgeAssist: { address: "0x06a332F84B5ae2672FbC8DDA3BC8Fa52cE2Ff794" },
            Token: { address: "0x1Cc29Ee9dd8d9ed4148F6600Ba5ec84d7Ee85D12" }
        }
    },
    busd: { address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" },
    pancakeFactory: { address: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73" },
    uniswapRouter: {
        address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        wbnb: { address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" }
    }
};
const et = {
    eth_mainnet: "mainnet",
    bsc_mainnet: "mainnet",
    polygon_mainnet: "mainnet",
    avax_mainnet: "mainnet",
    ftm_mainnet: "mainnet",
    rinkeby: "testnet",
    ropsten: "testnet",
    bsc_testnet: "testnet",
    polygon_testnet: "testnet",
    avax_testnet: "testnet",
    ftm_testnet: "testnet"
};
var fe = {
    eth_mainnet: "Ethereum",
    bsc_mainnet: "Binance Smart Chain",
    polygon_mainnet: "Polygon Mainnet",
    avax_mainnet: "Avalanche Mainnet",
    ftm_mainnet: "Fantom Mainnet",
    rinkeby: "Rinkeby",
    ropsten: "Ropsten",
    bsc_testnet: "Binance Smart Chain Testnet",
    polygon_testnet: "Polygon Mumbai Testnet",
    avax_testnet: "Avalanche Fuji Testnet",
    ftm_testnet: "Fantom Testnet"
};
var tt = {
    eth_mainnet: 1,
    bsc_mainnet: 56,
    polygon_mainnet: 137,
    avax_mainnet: 43114,
    ftm_mainnet: 250,
    rinkeby: 4,
    ropsten: 3,
    bsc_testnet: 97,
    polygon_testnet: 80001,
    avax_testnet: 43113,
    ftm_testnet: 4002
};
var nt = {
    eth_mainnet: "https://etherscan.io/",
    bsc_mainnet: "https://bscscan.com/",
    polygon_mainnet: "https://polygonscan.com/",
    avax_mainnet: "https://snowtrace.io/",
    ftm_mainnet: "https://ftmscan.com/",
    rinkeby: "https://rinkeby.etherscan.io/",
    ropsten: "https://ropsten.etherscan.io/",
    bsc_testnet: "https://testnet.bscscan.com/",
    polygon_testnet: "https://mumbai.polygonscan.com/",
    avax_testnet: "https://testnet.snowtrace.io/",
    ftm_testnet: "https://testnet.ftmscan.com/"
};
var at = {
    eth_mainnet: "/eth/mainnet",
    bsc_mainnet: "/bsc/mainnet",
    polygon_mainnet: "/polygon/mainnet",
    avax_mainnet: "/avax/mainnet",
    ftm_mainnet: "/fantom/mainnet",
    rinkeby: "/eth/rinkeby",
    ropsten: "/eth/ropsten",
    bsc_testnet: "/bsc/tesnet",
    polygon_testnet: "/polygon/testnet",
    avax_testnet: "/avax/testnet",
    ftm_testnet: "/fantom/tesnet"
};
function Be(e) {
    return Object.keys(fe).includes(e) ?
        {
            rpc: "https://speedy-nodes-nyc.moralis.io/bbf9383fd2ea1688c9c69ff0" + at[e],
            chainId: tt[e],
            scanner: nt[e],
            name: fe[e],
            short: e,
            type: et[e]
        } :
        {}
}
function st(e) {
    let t;
    for (t = e.length - 1;
        t >= 0 && e[t] === "0";
        t--);
    return e[t] != "." && t++, e.slice(0, t)
}
function M(e, t = 9, n = ".") {
    if (!e) return B.from(0);
    let [i, a] = e.split(n);
    return a || (a = ""), a = a.padEnd(t, "0").slice(0, t), B.from(i + a)
}
function g(e, t = 9, n = ".") {
    let i = e.toString();
    i.length <= t && (i = i.padStart(t + 1, "0"));
    const a = i.length - t;
    return st(i.slice(0, a) + n + i.slice(a))
}
const it = {
    "4": {
        provider: "https://speedy-nodes-nyc.moralis.io/8e0f19163628dfc14c27bba6/eth/rinkeby",
        scan: "https://rinkeby.etherscan.io/"
    },
    "97": {
        provider: "https://speedy-nodes-nyc.moralis.io/8e0f19163628dfc14c27bba6/bsc/testnet",
        scan: "https://testnet.bscscan.com/"
    }
}
const pt = {
    "1": {
        provider: "https://speedy-nodes-nyc.moralis.io/8e0f19163628dfc14c27bba6/eth/mainnet",
        scan: "https://etherscan.io/"
    },
    "56": {
        provider: "https://speedy-nodes-nyc.moralis.io/8e0f19163628dfc14c27bba6/bsc/mainnet",
        scan: "https://bscscan.com/"
    }
};
var Ce = { dev: it, prod: pt };
const A = g(B.from(0));
function ut(e) {
    const t = h[e][0].name;
    return Be(t).rpc
}
function rt(e) {
    const t = h[e][0].name;
    return "0x" + Be(t).chainId.toString(16)
}

const K = Ce.prod, Ie = Object.keys(K), G = Ie[1], J = Ie[0], ot = new ie(K[G].provider);
const yt = new ie(K[J].provider), lt = h[G][0].contracts.Token.address, Fe = h[G][0].contracts.Token.abi;
const dt = h[G][0].contracts.BridgeAssist.address, mt = h[J][0].contracts.Token.address, ct = h[J][0].contracts.Token.abi;
const Tt = h[J][0].contracts.BridgeAssist.address, ve = new pe(lt, Fe, ot), ae = new pe(mt, ct, yt);

const re = D("token", {
    state: () => (
        {
            provider: null,
            balanceETH: A,
            balanceBSC: A,
            allowanceETH: A,
            allowanceBSC: A,
            hashDispence: "",
            loading: !1
        }),
    actions: {
        async loadBefore() {

        },
        async load() {
            const e = C();
            if (!e.login) {
                console.error("Load in store/token.ts, user not is login");
                return
            } this.loading = !0, await Promise.all([this.getBalanceBSC(e.wallet), this.getBalanceETH(e.wallet)]), this.loading = !1, console.log("Loaded store/token.ts")
        },
        async approve(e, t, n) {
            const i = h[n][0].contracts.Token.address, a = new ie(K[n].provider), p = h[n][0].contracts.BridgeAssist.address;
            console.log(p);
            await (await new pe(i, Fe, a).connect(t).approve(p, e)).wait()
        },
        async getBalanceETH(e) {
            this.balanceETH = g(await ae.balanceOf(e));
            console.log((await ae.balanceOf(e)).toString());
            console.log(this.balanceETH, "ETH")
        },
        async getBalanceBSC(e) {
            this.balanceBSC = g(await ve.balanceOf(e));
            console.log(this.balanceBSC, "BSC")
        },
        async getAllowanceETH(e) {
            this.allowanceETH = await ae.allowance(Tt, e), console.log(this.allowanceETH, "al ETH")
        },
        async getAllowanceBSC(e) {
            this.allowanceBSC = await ve.allowance(dt, e), console.log(this.allowanceBSC, "al BSC")
        }
    }
})
const bt = Ce.prod, U = Object.keys(bt), I = U[0], se = [re];
const C = D("web3", {
    state: () => ({
        wallet: "",
        _signer: () => null,
        chainId: I,
        login: !1,
        loading: !1
    }),

    getters: { signer: e => e._signer() },
    actions: {

        async connect(e, t, n) { this.loading = !0, this.wallet = e, this._signer = () => t, this.login = !0, this.chainId = n, await this.loadContracts(), this.loading = !1 }, async before() { console.log(se), se.forEach(e => e().loadBefore()) }, async loadContracts() { se.forEach(e => e().load()) }, async connectWalletconnect() {
            try {
                console.log("Connecting to walletconnect...");
                const e = {};
                e[parseInt(I)] = ut(I);
                const t = window.WalletConnectProvider.default, n = new t({ rpc: e, chainId: parseInt(I), qrcode: !0 });
                await n.enable();
                const a = new ce(n).getSigner(), p = await a.getAddress();
                this.connect(p, a, I)
            } catch (e) { console.error(e) }
        },
        async connectMetamask() {
            var e, t, n;
            try {
                if (console.log("Connecting to metamask..."), !window.ethereum) throw new Error("Please set up MetaMask properly");
                const i = (await ((t = (e = window.ethereum).request) == null ? void 0 : t.call(e, { method: "eth_requestAccounts" })))[0], a = new ce(window.ethereum || window.web3), p = a.getSigner(), r = (n = await (a == null ? void 0 : a.getNetwork())) == null ? void 0 : n.chainId.toString();
                U.includes(r) || await this.switchChainId(I), this.connect(i, p, r), window.ethereum.once("chainChanged", async m => { await this.connectMetamask() }), window.ethereum.once("accountsChanged", this.addressChangeHandler)
            } catch (i) { console.error(i) }
        },
        async switchChainId(e) {
            var t, n;
            if (this.chainId !== e) try { await ((n = (t = window.ethereum).request) == null ? void 0 : n.call(t, { method: "wallet_switchEthereumChain", params: [{ chainId: rt(e) }] })), this.chainId = e, await this.connectMetamask() } catch (i) { console.error(i) }
        },
        async addressChangeHandler(e) {
            e[0] && (this.wallet = e[0]), window.ethereum.once("accountsChanged", this.addressChangeHandler)
        },
        disconnectWallet() {
            this.wallet = "", this.login = !1, this.loading = !1
        }
    }
});
const X = D("dialogs", {
    state: () => ({ currentDialog: void 0 }), actions: {
        async openDialog(e, t) {
            const n = { name: e, props: t };
            this.currentDialog = n
        },
        async closeCurrentDialog() {
            this.currentDialog = void 0
        }
    }
});
const ft = e => (x("data-v-526c39c1"), e = e(), k(), e), vt = { class: "header" }, wt = { href: "/" }, _t = ["src"], ht = { key: 0, class: "address-button" }, Mt = { class: "gradient-border" }, gt = { class: "white-fill" }, xt = ft(() => s("img", { style: { "margin-left": "5px", height: "10px" }, src: Qe }, null, -1)), kt = { key: 1, class: "buttons" }, At = f({
    setup(e) {
        const t = C(), n = X(), i = F(window.innerWidth), a = () => i.value = window.innerWidth;
        j(() => { window.addEventListener("resize", a) }), Y(() => window.removeEventListener("resize", a));
        const p = c(() => i.value > 950), r = c(() => p.value ? "/svg/logo.svg" : "/svg/logo-small.svg");
        return (m, T) => (o(), y("div", vt, [s("a", wt, [s("img", { src: u(r) }, null, 8, _t)]), u(t).login ? (o(), y("div", ht, [s("div", Mt, [s("div", gt, [s("button", { class: "address", onClick: T[0] || (T[0] = E => u(t).disconnectWallet()) }, [Me(l(u(p) ? u(t).wallet : u(t).wallet), 1), xt])])])])) : (o(), y("div", kt, [s("button", { class: "button", text: "Connect Metamask", onClick: T[1] || (T[1] = E => u(n).openDialog("connectDialog", {})) }, " Connect Wallet ")]))]))
    }
});
var Et = v(At, [["__scopeId", "data-v-526c39c1"]]);
const Ot = e => (x("data-v-10d6e37b"), e = e(), k(), e), Bt = { class: "transfer-form" }, Ct = Ot(() => s("p", { id: "input-hint" }, "Amount", -1)), It = { id: "transfer-input-wrapper" }, Ft = ["placeholder", "value"], St = { id: "button-wrapper" }, $t = f({
    props: { inputText: null, minAmount: null, tokenName: null, maxAvailible: null, invalidInput: { type: Boolean } }, emits: ["update:inputText", "update:invalidInput"], setup(e, { emit: t }) {
        const n = e, i = C();
        function a(b) {
            const d = +(n.inputText + b.data);
            b.data != null && (isNaN(d) || d < 0) && b.preventDefault()
        }
        const p = c(() => M(n.inputText).lt(M(n.minAmount.value))), r = c(() => M(n.inputText).gt(M(n.maxAvailible.value))), m = c(() => n.inputText != "" && (p.value || r.value || !i.login)), T = c(() => {
            if (!i.login) return "You need to connect your wallet first.";
            if (p.value) return `Minimum amount you can move is ${n.minAmount.value} ${n.tokenName}.`;
            if (r.value) return "Transfer amount exceeds balance"
        });
        Ue(() => n.inputText, () => { t("update:invalidInput", m.value) });
        const E = F(window.innerWidth), S = () => E.value = window.innerWidth;
        j(() => window.addEventListener("resize", S)), Y(() => window.removeEventListener("resize", S));
        const q = c(() => E.value > 950 ? `0.000000000 ${n.tokenName}` : "0.000000000");
        return (b, d) => (o(), y("div", Bt, [Ct, s("div", It, [s("div", { class: Te(u(m) ? "error-transfer-input" : "default-transfer-input") }, [s("input", { class: Te(u(m) ? "error-input" : "default-input"), type: "text", placeholder: u(q), value: e.inputText, onBeforeinput: a, onInput: d[0] || (d[0] = O => b.$emit("update:inputText", O.target.value)), spellcheck: "false", minlength: "1", maxlength: "30", autocomplete: "off", autocorrect: "off", inputmode: "decimal", pattern: "^[0-9]*[.,]?[0-9]*$" }, null, 42, Ft), s("div", St, [s("button", { id: "max-amount-button", onClick: d[1] || (d[1] = O => b.$emit("update:inputText", e.maxAvailible.value)) }, " MAX ")])], 2)]), ge(s("p", { id: "error-message" }, l(u(T)), 513), [[xe, u(m)]])]))
    }
});
var Ht = v($t, [["__scopeId", "data-v-10d6e37b"]]);
const W = e => (x("data-v-2bcb7406"), e = e(), k(), e), Dt = { class: "network-item" }, Wt = { class: "direction__span" }, Rt = { class: "network-name-wrapper" }, qt = ["src"], Lt = { class: "network-name" }, Nt = { key: 0, class: "input" }, Pt = { key: 1, class: "recieve-form" }, Vt = W(() => s("span", null, "You will receive", -1)), zt = { id: "recieve-amount" }, Ut = { class: "balance" }, jt = W(() => s("p", null, "Balance", -1)), Yt = { key: 2 }, Kt = { class: "recieve" }, Gt = W(() => s("p", null, "Fee", -1)), Jt = { class: "recieve" }, Xt = W(() => s("p", null, "Minimum amount", -1)), Zt = { key: 3, class: "fee" }, Qt = W(() => s("p", null, "Balance after receiving", -1)), en = f({
    props: { networkId: null, chain: null, transferFromThis: { type: Boolean }, iconPath: null, networkName: null, tokenName: null, balance: null, inputText: null, fee: null, feeOther: null, minAmount: null, minAmountOther: null }, setup(e) {
        const t = e, n = C(), i = c(() => {
            const r = M(t.inputText.value).sub(M(t.feeOther.value));
            return !n.login || r.lt(0) ? "0" : g(r)
        }), a = c(() => {
            const r = M(i.value).add(M(t.balance.value));
            return g(r)
        }), p = c(() => t.transferFromThis ? "From" : "To");
        return (r, m) => (o(), y("div", Dt, [s("span", Wt, l(u(p)), 1), s("div", Rt, [s("img", { id: "network-icon", src: e.iconPath }, null, 8, qt), s("p", Lt, l(e.networkName), 1)]), e.transferFromThis ? (o(), y("div", Nt, [ke(r.$slots, "default", {}, void 0, !0)])) : (o(), y("div", Pt, [Vt, s("span", zt, l(u(i)) + " " + l(e.tokenName), 1)])), s("div", Ut, [jt, s("p", null, l(e.balance.value) + " " + l(e.tokenName), 1)]), e.transferFromThis ? (o(), y("div", Yt, [s("div", Kt, [Gt, s("p", null, l(e.fee.value) + " " + l(e.tokenName), 1)]), s("div", Jt, [Xt, s("p", null, l(e.minAmount.value) + " " + l(e.tokenName), 1)])])) : (o(), y("div", Zt, [Qt, s("p", null, l(u(a)) + " " + l(e.tokenName), 1)]))]))
    }
});
var we = v(en, [["__scopeId", "data-v-2bcb7406"]]), tn = "/svg/small-close.svg";
const nn = ["src"], an = f({ props: { text: null, source: null, click: null }, setup(e) { return (t, n) => (o(), y("button", { class: "button text-style", onClick: n[0] || (n[0] = (...i) => e.click && e.click(...i)) }, [s("img", { class: "img-style", src: e.source }, null, 8, nn), Me(l(e.text), 1)])) } });
var _e = v(an, [["__scopeId", "data-v-744ec611"]]);
const sn = e => (x("data-v-9cf14ea6"), e = e(), k(), e), pn = { class: "gradient-border" }, un = sn(() => s("img", { src: tn }, null, -1)), rn = [un], on = { class: "dialog-form" }, yn = f({
    setup(e) {
        const t = X();
        return (n, i) => {
            var a, p;
            return ge((o(), y("div", { onClick: i[2] || (i[2] = (...r) => u(t).closeCurrentDialog && u(t).closeCurrentDialog(...r)), class: "custom-dialog" }, [s("div", pn, [s("div", { onClick: i[1] || (i[1] = je(() => { }, ["stop"])), class: "wrapper" }, [s("button", { class: "close-cross", onClick: i[0] || (i[0] = (...r) => u(t).closeCurrentDialog && u(t).closeCurrentDialog(...r)) }, rn), s("div", on, [(o(), Ae(Ee((a = u(t).currentDialog) == null ? void 0 : a.name), $(H((p = u(t).currentDialog) == null ? void 0 : p.props)), null, 16))])])])], 512)), [[xe, u(t).currentDialog !== void 0]])
        }
    }
});
var ln = v(yn, [["__scopeId", "data-v-9cf14ea6"]]);
let z = 0;
const R = D("alerts", {
    state: () => ({ alerts: [] }), actions: {
        async closeAlertAfterTimeout(e, t) {
            setTimeout(() => { this.closeAlert(e) }, t)
        }, async closeAlert(e) { this.alerts = this.alerts.filter(t => t.id !== e), this.alerts.length != 0 ? z = this.alerts[this.alerts.length - 1].id + 1 : z = 0 }, async createSimpleAlert(e, t, n) {
            const i = { id: z++, isWithInnerComponent: !1, title: e, message: t };
            return this.alerts.push(i), n !== void 0 && this.closeAlertAfterTimeout(i.id, n), i.id
        },
        async createAlertWithComponent(e, t, n) {
            const i = { id: z++, isWithInnerComponent: !0, component: e, props: t };
            return this.alerts.push(i), n !== void 0 && this.closeAlertAfterTimeout(i.id, n), i.id
        }
    }
})
const he = "https://locker-bridge.uc.r.appspot.com"
const dn = D("BridgeStore", {
    state: () => ({ feeETH: A, feeBSC: A, minTransferETH: A, minTransferBSC: A, loading: !1 }),
    actions: {
        async getTrasnferInfo() {
            const e = (await be.get(`${he}/info`)).data;
            this.feeBSC = g(B.from(e.BE)), this.feeETH = g(B.from(e.EB)), this.minTransferBSC = g(B.from(e.MIN_BE)), this.minTransferETH = g(B.from(e.MIN_EB))
        },
        async swapTokens(e, t, n) {
            const i = C(), a = R(), p = re();
            await i.switchChainId(e);
            await p.approve(M(t), i.signer, e);
            const r = await a.createAlertWithComponent("infoAlert", { message: "Processing your request" });
            const m = await be.get(`${he}/process?`,
                {
                    params:
                    {
                        direction: n, address: i.wallet
                    }
                })
                .catch(T => {
                    a.closeAlert(r);
                    T.response && T.response.status == 500 ?
                        a.createAlertWithComponent("failureSwapAlert",
                            {
                                message: "There was an internal error. Your tokens was locked but not dispenced. Please contacts us and we solve it!"
                            }) :
                        a.createAlertWithComponent("failureSwapAlert",
                            {
                                message: "There was an internal error. Please contacts us and we fix it!"
                            })
                });
            m && m.status === 200 && (a.closeAlert(r), a.createAlertWithComponent("successSwapAlert", { txHash: m.data.txHashDispense }))
        }
    }
});
const mn = e => (x("data-v-52ac13f8"), e = e(), k(), e), cn = { class: "wrapper" }, Tn = { class: "bridge" }, bn = { class: "name" }, fn = mn(() => s("hr", null, null, -1)), vn = { class: "swapper" }, wn = ["disabled"], _n = f({
    setup(e) {
        const t = C(), n = re(), i = dn();
        R();
        const a = X(), { login: p } = te(t);
        const { balanceETH: r, balanceBSC: m } = te(n);
        const { feeETH: T, feeBSC: E, minTransferBSC: S, minTransferETH: q } = te(i);
        const b = "LOCKER", d = F(""), O = F(!1), _ = ne({ networkId: "BE", chain: U[1], transferFromThis: !0, iconPath: "svg/bsc-icon.svg", networkName: "Binance Smart Chain", tokenName: b, balance: m, inputText: d, fee: E, feeOther: T, minAmount: S, minAmountOther: q }), L = ne({ networkId: "EB", chain: U[0], transferFromThis: !1, iconPath: "svg/eth-icon.svg", networkName: "Ethereum Mainnet", tokenName: b, balance: r, inputText: d, fee: T, feeOther: E, minAmount: S, minAmountOther: q }), Q = ne({ inputText: d.value, minAmount: _.value.minAmount, tokenName: b, maxAvailible: _.value.balance, invalidInput: O.value });
        function He() { [_.value, L.value] = [L.value, _.value], _.value.transferFromThis = !0, L.value.transferFromThis = !1, Q.value.minAmount = _.value.minAmount, Q.value.maxAvailible = _.value.balance }
        const ye = F(window.innerWidth), le = () => ye.value = window.innerWidth, De = c(() => ye.value > 950);
        const We = c(() => De.value ? `Bridge ${b} tokens` : "Bridge tokens");
        async function Re() {
            p.value ?
                (await i.swapTokens(_.value.chain, d.value, _.value.networkId), d.value = "", await n.load()) :
                a.openDialog("connectDialog", {})
        }
        return j(async () => {
            window.addEventListener("resize", le), await i.getTrasnferInfo()
        }),
            Y(() => window.removeEventListener("resize", le)),
            (qe, N) => (o(), y("div", cn, [ke(qe.$slots, "default", {}, void 0, !0),
            s("div", Tn, [s("p", bn, l(u(We)), 1), fn, s("p", { class: "discription" }, " Change your " + l(b) + " tokens between Ethereum Network and Binance Smart Chain "),
            s("div", vn, [w(we, $(H(u(_))), {
                default: ue(() => [w(Ht, Ye(u(Q), {
                    inputText: d.value, "onUpdate:inputText": N[0] || (N[0] = ee => d.value = ee),
                    invalidInput: O.value, "onUpdate:invalidInput": N[1] || (N[1] = ee => O.value = ee)
                }), null, 16, ["inputText", "invalidInput"])]), _: 1
            }, 16),
            s("div", { id: "switch-button-wrapper" }, [s("button", { id: "switch-button", onClick: He })]), w(we, $(H(u(L))), null, 16)]),
            s("button", { id: "bridge-button", onClick: Re, disabled: u(p) && (O.value || d.value === "") }, l(u(p) ? "Bridge" : "Connect Wallet"), 9, wn)]), w(ln)]))
    }
});
var hn = v(_n, [["__scopeId", "data-v-52ac13f8"]]);
const Mn = { class: "alert-wrapper" }, gn = { key: 0 }, xn = { key: 1 }, kn = f({
    props: { id: null, isWithInnerComponent: { type: Boolean }, component: null, props: null, title: null, message: null }, setup(e) {
        const t = e, n = R();
        return (i, a) => (o(), y("div", Mn, [s("button", { class: "close__btn", onClick: a[0] || (a[0] = p => u(n).closeAlert(t.id)) }), e.isWithInnerComponent ? (o(), y("div", gn, [(o(), Ae(Ee(e.component), $(H(t.props)), null, 16))])) : (o(), y("div", xn, [s("h1", null, l(e.title), 1), s("p", null, l(e.message), 1)]))]))
    }
});
var An = v(kn, [["__scopeId", "data-v-6dc87630"]]);
const En = { id: "alerts" }, On = f({
    setup(e) {
        const t = R();
        return (n, i) => (o(), y("div", En, [w(Ge, { name: "alerts-list", tag: "ul" }, { default: ue(() => [(o(!0), y(Oe, null, Ke(u(t).alerts, a => (o(), y("li", { key: a.id }, [w(An, $(H(a)), null, 16)]))), 128))]), _: 1 })]))
    }
});
var Bn = v(On, [["__scopeId", "data-v-4620a30a"]]);
const Cn = f({
    setup(e) {
        R();
        const t = F(window.innerWidth), n = () => t.value = window.innerWidth;
        return j(() => { window.addEventListener("resize", n) }), Y(() => window.removeEventListener("resize", n)), c(() => t.value > 950), (i, a) => (o(), y(Oe, null, [w(Et), w(hn, { id: "wrapper-bridge" }, { default: ue(() => [w(Bn)]), _: 1 })], 64))
    }
});
var In = "/assets/error-alert-icon.471f4b2c.svg";
const Fn = { name: "failureSwapAlert" }, Se = e => (x("data-v-4fc916aa"), e = e(), k(), e), Sn = { class: "failure-alert-wrapper" }, $n = Se(() => s("img", { src: In }, null, -1)), Hn = Se(() => s("div", { class: "alert-body" }, [s("span", null, "Error!"), s("p", null, " There was an internal error. Your tokens was locked but not dispenced. Please contacts us and we solve it! ")], -1)), Dn = [$n, Hn];
function Wn(e, t, n, i, a, p) { return o(), y("div", Sn, Dn) } var Rn = v(Fn, [["render", Wn], ["__scopeId", "data-v-4fc916aa"]]), qn = "/assets/success-alert-icon.d9403e68.svg";
const oe = e => (x("data-v-ed8fe730"), e = e(), k(), e), Ln = { class: "success-alert-wrapper" }, Nn = oe(() => s("img", { src: qn }, null, -1)), Pn = { class: "alert-body" }, Vn = oe(() => s("span", null, "Success!", -1)), zn = oe(() => s("p", { class: "succesful-alert-message" }, " You can follow the status of your transaction with the following link: ", -1)), Un = { class: "tx-hash-wrapper" }, jn = { class: "tx-hash__p" }, Yn = { name: "successSwapAlert" }, Kn = f(V(P({}, Yn), {
    props: { txHash: null }, setup(e) {
        const t = e;
        function n() { navigator.clipboard.writeText(t.txHash) } return (i, a) => (o(), y("div", Ln, [Nn, s("div", Pn, [Vn, zn, s("div", Un, [s("button", { class: "copy-hash__btn", onClick: n }), s("p", jn, l(e.txHash), 1)])])]))
    }
}));
var Gn = v(Kn, [["__scopeId", "data-v-ed8fe730"]]), Jn = "/assets/info-alert-icon.5e98c413.svg";
const $e = e => (x("data-v-3db9da2e"), e = e(), k(), e), Xn = { class: "info-alert-wrapper" }, Zn = $e(() => s("img", { src: Jn }, null, -1)), Qn = { class: "alert-body" }, ea = $e(() => s("span", null, "Info", -1)), ta = { name: "infoAlert" }, na = f(V(P({}, ta), { props: { message: null }, setup(e) { return (t, n) => (o(), y("div", Xn, [Zn, s("div", Qn, [ea, s("p", null, l(e.message), 1)])])) } }));
var aa = v(na, [["__scopeId", "data-v-3db9da2e"]]), sa = [Rn, Gn, aa];
const ia = e => (x("data-v-03ed3493"), e = e(), k(), e), pa = { class: "connect-dialog" }, ua = ia(() => s("div", { class: "title" }, [s("span", { class: "connect-text" }, "Connect to a Wallet"), s("hr"), s("span", { class: "small-text" }, "To continue you need to connect to a Wallet")], -1)), ra = { class: "connect-buttons" }, oa = { name: "connectDialog" }, ya = f(V(P({}, oa), {
    setup(e) {
        const t = X(), n = C();
        return (i, a) => (o(), y("div", pa, [ua, s("div", ra, [w(_e, { text: "Connect Wallet", source: "/svg/wallet-icon.svg", onClick: a[0] || (a[0] = p => { u(n).connectWalletconnect(), u(t).closeCurrentDialog() }) }), w(_e, { text: "Connect Metamask", source: "/svg/metamask.svg", onClick: a[1] || (a[1] = p => { u(n).connectMetamask(), u(t).closeCurrentDialog() }) })])]))
    }
}));
var la = v(ya, [["__scopeId", "data-v-03ed3493"]]), da = [la];
const Z = Je(Cn);
sa.forEach(e => { Z.component(e.name, e) });
da.forEach(e => { Z.component(e.name, e) });
Z.use(Xe());
Z.mount("#app");
