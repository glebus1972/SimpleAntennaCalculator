function checnum(e, t, n) {
    let i = e.value;
    i.lastIndexOf(",") >= 0 && (i = i.replace(",", "."), e.value = i), i.lastIndexOf("-") > 0 && (i = i.substring(0, i.length - 1), e.value = i), 0 == i.lastIndexOf("0") && 1 == e.value.length && (i += ".", e.value = i), 0 == i.lastIndexOf(".") && (i = "0" + i, e.value = i);
    let a, l = "0123456789";
    void 0 !== t && 1 == t && (l += "-"), void 0 !== n ? 0 == n && (l += ",.") : l += ",.";
    let s = i;
    if (0 != s.length) {
        for (let t = 0; t < s.length; t++) a = s.charAt(t), -1 == l.indexOf(a) && (i = i.substring(0, i.length - 1), e.value = i);
        null != e.value.match(/\./g) && e.value.match(/\./g).length > 1 && (e.value = e.value.substr(0, e.value.lastIndexOf(".")))
    }
}

function checAWG(e) {
    let t = e.value;
    if (t = t.replace(/[^0-9]/g, ""), t.startsWith("0")) t.length > 4 && (t = t.substring(0, 4)), /^0+$/.test(t) || (t = t.replace(/[^0]/g, "")); else if (t.length > 0) {
        let e = parseInt(t, 10);
        e > 50 && (t = t.substring(0, t.length - 1)), t.length > 1 && t.startsWith("0") && (t = parseInt(t, 10).toString())
    }
    e.value = t
}

function validateWireInput(e) {
    const t = e.parentElement.querySelector(".wire-gauge-select"), n = t && "awg" === t.value;
    n ? checAWG(e) : checnum(e, !1, !1)
}

function setCenterFrequency(e) {
    var t = document.holder;
    void 0 !== e && (t = document.holder2);
    var n = 1 * t.cent_freq.value, i = t.freq;
    n > 0 ? (i.value = n, i.readOnly = !0, i.style.opacity = "0.7") : (i.value = "", i.readOnly = !1, i.style.opacity = "1"), i.dispatchEvent(new Event("input", {bubbles: !0}))
}

function msgError(e) {
    let t = new CommonLanguageHelper, n = t.MSG;
    return 400 == e ? n = t.MSG400 : 401 == e && (n = t.MSG401), n
}

function msgPreventClicking() {
    let e = new CommonLanguageHelper;
    return e.MSGV
}

function uniRecalculate(e) {
    const t = e.closest(".input-wrapper"), n = t.querySelector(".input-field");
    if (!n) return;
    const i = (document.querySelector(".segment-btn.active") || {}).id || "SI",
        a = e.classList.contains("wire-gauge-select"), l = 1 === e.selectedIndex;
    if (a) {
        let e = n.value;
        if (l) {
            let t = "USCS" === i ? 25.4 * parseFloat(e) : parseFloat(e);
            if (isNaN(t)) return;
            let a = LocaleUtils.converttoAWG(t);
            n.value = "" !== a ? a : e
        } else {
            let t = LocaleUtils.convertfromAWG(e);
            if (-1 === t) return;
            let a = "USCS" === i ? t / 25.4 : t;
            n.value = LocaleUtils.formatOut(a)
        }
    } else {
        let t = parseFloat(n.value);
        if (isNaN(t)) return;
        const i = parseFloat(e.dataset.ratio) || 1;
        l ? t *= i : t /= i, n.value = LocaleUtils.formatOut(t)
    }
    n.dispatchEvent(new Event("input", {bubbles: !0}))
}

function changeUnits(e, t = 0) {
    let n = e.closest(".rt, table");
    if (0 == e.value) void 0 !== window[e.id + "a"] && (n.innerHTML = window[e.id + "a"]); else {
        window[e.id + "a"] = n.innerHTML;
        let i = n.querySelectorAll("td");
        for (let n = 0; n < i.length; n++) {
            let a = i[n];
            if (null !== a.firstElementChild && (a = i[n].children[0]), isNaN(a.innerHTML) || i[n].innerHTML.includes("mm²")) {
                let l = "×…", s = parseFloat(a.innerHTML), r = 0;
                if (!isNaN(s)) for (let n = 0; n < l.length; n++) a.innerHTML.includes(l[n]) && (r = parseFloat(a.innerHTML.substring(a.innerHTML.lastIndexOf(l[n]) + 1)), !isNaN(r) && r > 0 && (a.innerHTML = LocaleUtils.formatLength(s, e.value, t) + " " + l[n] + " " + LocaleUtils.formatLength(r, e.value, t)));
                if (i[n].innerHTML.includes("mm²")) {
                    let e = parseFloat(a.innerHTML), t = LocaleUtils.converttoAWG(e);
                    i[n].innerHTML = "<strong>" + t + "</strong> AWG#"
                }
            } else {
                let n = LocaleUtils.formatLength(a.innerHTML, e.value, t);
                a.innerHTML = n
            }
        }
    }
}

class LocaleUtils {
    static getActualWireDiam(e) {
        let t = Math.PI * e * e / 4, n = [.5, .75, 1, 1.5, 2, 2.5, 4, 6, 10, 16, 25, 35, 50, 70], i = 0;
        for (let e = 0; e < n.length - 1; e++) t > n[e] && t < n[e + 1] && (i = t > (n[e] + n[e + 1]) / 2 ? 2 * Math.sqrt(n[e + 1] / Math.PI) : 2 * Math.sqrt(n[e] / Math.PI));
        return i
    }

    static toStringWithoutZero(e) {
        let t = e - Math.floor(e);
        return 0 === t ? e.toFixed(1).replace(/\.0$/, "") : String(e)
    }

    static roundTo(e, t) {
        if (!isFinite(e)) return 0;
        let n = Math.pow(10, t);
        return Math.round(e * n) / n
    }

    static formatOut(e) {
        let t = e < 1e-4 ? 6 : e < .001 ? 5 : e < .01 ? 4 : e < .1 ? 3 : 2;
        return LocaleUtils.toStringWithoutZero(LocaleUtils.roundTo(e, t))
    }

    static setLocaleLength(e, t) {
        let n = 1 == t ? 25.1 : 1, i = 1;
        1 == t && (i = 3);
        let a = e / n;
        return Number(a.toFixed(i))
    }

    static formatAWG(e) {
        return e > 0 ? String(e) : -1 === e ? "00" : -2 === e ? "000" : -3 === e ? "0000" : null
    }

    static converttoAWG(e) {
        if (e <= 0 || e > 12) return "";
        let t = 36 - 39 * Math.log(e / .127) / Math.log(92), n = Math.round(t);
        return n < -3 || n > 50 ? "" : n <= 0 ? "0".repeat(Math.abs(n) + 1) : String(n)
    }

    static convertfromAWG(e) {
        const t = String(e).trim();
        if (!/^(0{1,4}|([0-9]|[1-4][0-9]|50))$/.test(t)) return -1;
        let n;
        return n = /^0+$/.test(t) ? 1 === t.length ? 0 : 1 - t.length : parseInt(t, 10), isNaN(n) ? -1 : .127 * Math.pow(92, (36 - n) / 39)
    }

    static format_mmToImperial(e, t) {
        let n = new CommonLanguageHelper;
        const i = 25.4;
        let a = e / i;
        if (0 == a) return "0ʺ";
        if (a < .01) return formatDecimal(1e3 * a, 2) + " " + n.CALC_MIL;
        if (a < .03125) return this.formatDecimal(a, 3) + "ʺ";
        if (a >= 72) {
            let e = a / 12;
            if (e <= 1e3) {
                let t = e < 20 ? 3 : e < 100 ? 2 : 1;
                return this.formatDecimal(e, t) + " " + n.CALC_FOOT
            }
            {
                let t = e / 5280, i = t < 20 ? 2 : t < 100 ? 1 : 0;
                return this.formatDecimal(t, i) + " " + n.CALC_MI
            }
        }
        if (2 === t || 3 === t) return this.formatDecimal(a, t) + "ʺ";
        let l = 1 === t ? 32 : 16;
        a < .15 && (l = 32);
        let s = Math.floor(a), r = a - s, o = Math.round(r * l);
        if (o === l && (s++, o = 0), o > 0) {
            let e = this.gcd(o, l), t = o / e, n = l / e;
            return 0 === s ? `${t}/${n}ʺ` : `${s} ${t}/${n}ʺ`
        }
        return `${s}ʺ`
    }

    static formatUniversalSI(e, t) {
        let n = new CommonLanguageHelper;
        if (e <= 0) return "0 ".n.CALC_MM;
        if (e >= 1e6) {
            let t = e / 1e6, i = t < 1 ? 3 : t < 10 ? 2 : t < 100 ? 1 : 0;
            return this.formatDecimal(t, i) + " " + n.CALC_KM
        }
        if (e >= 1e3) {
            let t = e / 1e3, i = t < 10 ? 3 : t < 100 ? 2 : 1;
            return this.formatDecimal(t, i) + " " + n.CALC_M
        }
        let i = e < 1 ? 3 : e < 10 ? 2 : e < 100 ? 1 : 0;
        t > 1 && (t -= 1);
        let a = Math.max(i, t);
        return this.formatDecimal(e, a) + " " + n.CALC_MM
    }

    static formatDecimal(e, t) {
        return t <= 0 ? String(Math.round(e)) : e.toFixed(t).replace(/\.?0+$/, "")
    }

    static gcd(e, t) {
        return 0 === t ? e : this.gcd(t, e % t)
    }

    static formatLength(e, t, n) {
        return 1 == t ? this.format_mmToImperial(e, n) : this.formatUniversalSI(e, n)
    }
}

window.CalcUtils = window.CalcUtils || {}, CalcUtils.getBaseValueMM = function (e) {
    if (!e || !e.value) return 0;
    var t = e.parentElement.querySelector(".suffix-select");
    if (t && "awg" === t.value) return LocaleUtils.convertfromAWG(e.value);
    var n = parseFloat(e.value) || 0;
    if (!e.classList.contains("unit-convertible")) return n;
    var i = (document.querySelector(".segment-btn.active") || {}).id || "SI";
    if (e.classList.contains("large-length")) return "USCS" === i ? 304.8 * n : 1e3 * n;
    if (e.classList.contains("superlarge-length")) return "USCS" === i ? 1609344 * n : 1e6 * n;
    if (t && !t.classList.contains("unit-index-only")) {
        var a = parseFloat(t.value) || 1, l = "USCS" === i ? 25.4 : 1;
        return n / a * l
    }
    return "USCS" === i ? 25.4 * n : n
}, CalcUtils.getSystemIndex = function () {
    const e = document.querySelector(".segment-btn.active");
    return e && "USCS" === e.id ? 1 : 0
}, CalcUtils.autoResizeTextArea = function (e) {
    e && (e.style.height = "auto", e.style.height = e.scrollHeight + 2 + "px")
}, CalcUtils.updateHorizontalLines = function (e) {
    if (!e) return;
    const t = Math.floor(e.clientWidth / 20), n = "—".repeat(t);
    e.value.includes("[hr]") && (e.value = e.value.replace(/\[hr\]/g, n))
}, function () {
    function e(e) {
        if (e && e.classList.contains("unit-convertible")) {
            var t = (document.querySelector(".segment-btn.active") || {}).id || "SI",
                n = e.parentElement.querySelector(".suffix-select"), i = CalcUtils.getBaseValueMM(e),
                a = "USCS" === t ? s : 1;
            if (n && "awg" === n.value) e.value = LocaleUtils.converttoAWG(i); else {
                var l = n && !n.classList.contains("unit-index-only") ? parseFloat(n.value) : 1, r = i * a * l;
                e.value = LocaleUtils.formatOut(r)
            }
        }
    }

    function t() {
        var e = document.getElementById("save_state_agreement");
        if (!e || !e.checked) return localStorage.removeItem(a), void localStorage.removeItem(l);
        var t = {
            values: {},
            selectors: {},
            settings: {},
            system: (document.querySelector(".segment-btn.active") || {}).id || "SI"
        };
        document.querySelectorAll("input.input-field:not(.output-field, .not-save), .m3-input, .m3-input-field").forEach(function (e) {
            e.id && (t.values[e.id] = e.classList.contains("unit-convertible") ? CalcUtils.getBaseValueMM(e) : e.value)
        }), document.querySelectorAll(".suffix-select").forEach(function (e) {
            e.id && (e.classList.contains("unit-index-only") || e.classList.contains("wire-gauge-select") ? t.selectors[e.id] = {index: e.selectedIndex} : t.selectors[e.id] = {value: e.value})
        }), document.querySelectorAll("select.select-field").forEach(function (e) {
            e.id && (t.settings[e.id] = e.value)
        });
        var n = new Set;
        document.querySelectorAll('input[type="radio"]').forEach(function (e) {
            n.add(e.name)
        }), n.forEach(function (e) {
            var n = document.querySelector('input[name="' + e + '"]:checked');
            n && (t.values[e] = n.value)
        }), document.querySelectorAll('input[type="checkbox"]').forEach(function (e) {
            e.id && (t.settings[e.id] = e.checked)
        }), localStorage.setItem(a, JSON.stringify(t)), localStorage.setItem(l, "true")
    }

    function n() {
        var e = localStorage.getItem(l), t = localStorage.getItem(a),
            n = document.getElementById("save_state_agreement");
        if (n && (n.checked = "true" === e), t && "true" === e) {
            for (var r = JSON.parse(t), o = document.querySelectorAll(".segment-btn"), c = 0; c < o.length; c++) o[c].id === r.system ? (o[c].classList.add("active"), i(r.system)) : o[c].classList.remove("active");
            for (var u in r.selectors) {
                var h = document.getElementById(u);
                if (h) {
                    var f = r.selectors[u];
                    void 0 !== f.index ? h.selectedIndex = f.index : void 0 !== f.value && (h.value = f.value)
                }
            }
            if (r.settings) for (var d in r.settings) {
                var v = document.getElementById(d);
                v && (v.value = r.settings[d], v.dispatchEvent(new Event("change", {bubbles: !0}))), v && "checkbox" === v.type && (v.checked = r.settings[d], v.dispatchEvent(new Event("change", {bubbles: !0})))
            }
            var m = "USCS" === r.system, C = m ? s : 1, L = m ? 1 / 304.8 : .001, g = m ? 1 / 1609344 : 1e-6;
            for (var A in r.values) {
                var p = document.getElementById(A);
                if (p) {
                    var E = r.values[A];
                    if (p.classList.contains("unit-convertible")) {
                        var S = p.parentElement.querySelector(".suffix-select");
                        if (S && "awg" === S.value) p.value = LocaleUtils.converttoAWG(E); else {
                            var _ = S && !S.classList.contains("unit-index-only") ? parseFloat(S.value) : 1, M = C;
                            p.classList.contains("superlarge-length") ? M = g : p.classList.contains("large-length") && (M = L);
                            var y = E * M * _;
                            p.value = LocaleUtils.formatOut(y)
                        }
                    } else p.value = E;
                    p.dispatchEvent(new Event("input", {bubbles: !0}))
                }
            }
            for (var A in r.values) {
                var I = document.querySelector('input[name="' + A + '"][value="' + r.values[A] + '"]');
                I && (I.checked = !0, I.dispatchEvent(new Event("change", {bubbles: !0})))
            }
        }
    }

    function i(e) {
        var t = "USCS" === e;
        document.querySelectorAll(".suffix-select").forEach(function (t) {
            var n = t.selectedIndex;
            t.classList.contains("wire-gauge-select") ? t.innerHTML = r[e].wire : t.classList.contains("unit-index-only") || (t.innerHTML = r[e].selects), -1 !== n && (t.selectedIndex = n)
        }), document.querySelectorAll(".unit-convertible").forEach(function (e) {
            var n = e.closest(".input-wrapper"), i = n ? n.querySelector(".suffix") : null;
            i && !n.querySelector(".suffix-select") && (e.classList.contains("superlarge-length") ? i.innerText = t ? "mi" : "km" : e.classList.contains("large-length") ? i.innerText = t ? "ft" : "m" : i.innerText = t ? "in" : "mm")
        })
    }

    var a = "calc_data_" + window.location.pathname.replace(/\//g, "_"),
        l = "calc_consent_" + window.location.pathname.replace(/\//g, "_"), s = 1 / 25.4, r = {
            SI: {
                selects: '<option value="1">mm</option><option value="1000">µm</option>',
                wire: '<option value="1">mm</option><option value="awg">AWG</option>'
            },
            USCS: {
                selects: '<option value="1">in</option><option value="1000">mil</option>',
                wire: '<option value="1">in</option><option value="awg">AWG</option>'
            }
        };
    window.switchGlobalSystem = function (e, n) {
        if (n && !n.classList.contains("active")) {
            var a = {};
            document.querySelectorAll("input.input-field:not(.output-field), .m3-input:not(.output-field)").forEach(function (e) {
                e.id && (a[e.id] = CalcUtils.getBaseValueMM(e))
            });
            var l = n.parentElement.querySelectorAll(".segment-btn");
            l.forEach(function (e) {
                e.classList.remove("active")
            }), n.classList.add("active"), i(e);
            var r = "USCS" === e, o = r ? s : 1, c = r ? 1 / 304.8 : .001, u = r ? 1 / 1609344 : 1e-6;
            document.querySelectorAll(".unit-convertible:not(.output-field)").forEach(function (e) {
                var t = e.parentElement.querySelector(".suffix-select"), n = a[e.id];
                if (void 0 !== n) {
                    if (t && "awg" === t.value) e.value = LocaleUtils.converttoAWG(n); else {
                        var i = t && !t.classList.contains("unit-index-only") ? parseFloat(t.value) : 1, l = o;
                        e.classList.contains("superlarge-length") ? l = u : e.classList.contains("large-length") && (l = c), e.value = LocaleUtils.formatOut(n * l * i)
                    }
                    e.dispatchEvent(new Event("change", {bubbles: !0})), e.dispatchEvent(new Event("input", {bubbles: !0}))
                }
            }), t()
        }
    }, document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            n()
        }, 0), document.addEventListener("change", function (n) {
            if (n.target.classList.contains("suffix-select")) {
                var i = n.target.parentElement.querySelector(".input-field");
                i && e(i)
            }
            ("sigma-optimal-check" === n.target.id || n.target.classList.contains("m3-slider") || n.target.classList.contains("m3-input-field") || n.target.classList.contains("input-field") || n.target.classList.contains("select-field") || "radio" === n.target.type || n.target.classList.contains("suffix-select") || "save_state_agreement" === n.target.id) && t()
        }), document.querySelectorAll(".only-integers").forEach(function (e) {
            e.addEventListener("input", function () {
                this.value = this.value.replace(/\D/g, ""), this.dispatchEvent(new Event("change", {bubbles: !0}))
            })
        }), document.querySelectorAll(".current-year").forEach(function (e) {
            e.textContent = (new Date).getFullYear()
        })
    })
}();

class CommonLanguageHelper {
    constructor() {
        this.lng = document.documentElement.lang, "ua-ua" == this.lng ? (this.CALC_MM = "мм", this.CALC_M = "м", this.CALC_KM = "км", this.CALC_MKM = "мкм", this.CALC_MIL = "мил", this.CALC_MI = "миль", this.CALC_FOOT = "фут", this.CALC_MHZ = " МГц", this.CALC_GHZ = " ГГц", this.CALC_NHENRY = "нГн", this.CALC_PFARAD = "пФ", this.CALC_NSEC = "нсек", this.CALC_ALERT = "Введить корректні дані!", this.CALC_FREQ = "Частота", this.CALC_KHARCHENKO_FREQ = "Центральна частота", this.CALC_WIRE_DIAMETER = "Діаметр дроту", this.CALC_DISTANCE = "Відстань", this.CALC_INPUT_IMPEDANCE = "Вхідний імпеданс антени", this.CALC_WAVELENGTH = "Довжина хвилі", this.CALC_ELEMENT_DIAMETER = "Діаметр елемента", this.CALC_GAIN = "Прибл. підсилення антени", this.CALC_WIDEBAND2 = "Смуга пропуску за критерієм КСВ<2", this.CALC_REFLECTOR_LENGTH = "Довжина рефлектора", this.CALC_DIPOLE_LENGTH = "Довжина вібратора", this.CALC_DIRECTOR_LENGTH = "Довжина директора", this.CALC_BOOM_LENGTH = "Мінімальна довжина стріли", this.CALC_APPROX = "прибл.)", this.CALC_DIMEN = "Розмір", this.MSG400 = "Невірний формат запроса. JavaScript застаріл. Спробуйте оновити кеш браузера.", this.MSG401 = "Час сесії вичерпано. Оновіть сторінку браузера.", this.MSGV = "Do not click so often, you son of a bitch", this.MSG = "Трапилась помилка. Повторіть спробу.", this.CALC_KHARCHENKO_ALERT = "Рабоча частота знаходиться за лімітами можливостей цього калькулятора") : (this.CALC_MM = "mm", this.CALC_M = "m", this.CALC_KM = "km", this.CALC_MKM = "µm", this.CALC_MIL = "mil", this.CALC_MI = "mi", this.CALC_FOOT = "ft", this.CALC_MHZ = " MHz", this.CALC_GHZ = " GHz", this.CALC_NHENRY = "nH", this.CALC_PFARAD = "pF", this.CALC_NSEC = "nsec", this.CALC_ALERT = "Enter correct data!", this.CALC_FREQ = "Frequency", this.CALC_KHARCHENKO_FREQ = "Mean frequency of the range", this.CALC_WIRE_DIAMETER = "Wire diameter", this.CALC_DISTANCE = "Distance", this.CALC_INPUT_IMPEDANCE = "Antenna input impedance", this.CALC_WAVELENGTH = "Wavelength", this.CALC_ELEMENT_DIAMETER = "Element diameter", this.CALC_GAIN = "Approx. antenna gain", this.CALC_WIDEBAND2 = "Bandwidth by VSWR < 2", this.CALC_REFLECTOR_LENGTH = "Reflector length", this.CALC_DIPOLE_LENGTH = "Dipole length", this.CALC_DIRECTOR_LENGTH = "Director length", this.CALC_BOOM_LENGTH = "Minimum boom length", this.CALC_APPROX = "approx.)", this.CALC_DIMEN = "Dimension", this.MSG400 = "Invalid request format. JavaScript is out of date. Try to refresh the browser cache.", this.MSG401 = "Session time is over. Refresh your browser page.", this.MSGV = "Don't click too often", this.MSG = "An error has occurred. Try again.", this.CALC_KHARCHENKO_ALERT = "The operating frequency is beyond the capabilities of this calculator")
    }
}