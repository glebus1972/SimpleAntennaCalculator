function clearResult() {
    document.holder.a.value = "", document.holder.b.value = ""
}

function calc() {
    var e = CalcUtils.getSystemIndex(), l = CalcUtils.getBaseValueMM(document.holder.freq),
        t = CalcUtils.getBaseValueMM(document.holder.d);
    let o = GroundPlaneRoutine.solveGP(l, t, e), a = o.split(";");
    a.length > 1 ? (document.holder.a.value = a[0], document.holder.b.value = a[1]) : alert(o)
}

class GroundPlaneRoutine {
    static vf_monopole(e) {
        let l = Math.pow(e, 3), t = Math.pow(e, 2);
        if (e < 10) var o = .88;
        else e >= 10 && e < 20 ? o = -80635178777887e-19 * l + .000241905536333661 * t + .00280529642444226 * e + .84338 : e >= 20 && e < 30 ? o = 8717589388943497e-21 * l - .0007649608996702708 * t + .022942625144520896 * e + .7091311418661425 : e >= 30 && e < 40 ? o = -13868396779852866e-22 * l + .0001444377163533197 * t - .00433933333618682 * e + .9819507266732196 : e >= 40 && e < 50 ? o = 6.497693229976498e-7 * l - 9995536376463266e-20 * t + .005436389868531275 * e + .8516077506103117 : e >= 50 && e < 60 ? o = -5.223761400531283e-8 * l + 5345676785811738e-21 * t + .00017133784100905556 * e + .939358617735682 : e >= 60 && e < 70 ? o = 5.918113302360148e-8 * l - 14709697679392837e-21 * t + .0013746603089213301 * e + .9152921683774365 : e >= 70 && e < 80 ? o = 3.5513081910906925e-8 * l - 9739406945726982e-21 * t + .0010267399575647203 * e + .9234103099090907 : e >= 80 && e < 90 ? o = -5.2334606672291705e-9 * l + 3.9763273025681444e-8 * t + .00024440634006450717 * e + .9442725397090964 : e >= 90 && e < 100 ? o = 2.542076075800976e-8 * l - 823687651178883e-20 * t + .000989303920697813 * e + .9219256122900972 : e >= 100 && e < 200 ? o = 1.7193387358250182e-9 * l - 11264499051334073e-22 * t + .0002782612600322709 * e + .945627034312282 : e >= 200 && e < 300 ? o = 2.202720085929468e-10 * l - 2.270098687941645e-7 * t + 9837325276442236e-20 * e + .9576195681301385 : e >= 300 && e < 1e3 ? o = 1.3639470128389419e-11 * l - 4.1040584176062875e-8 * t + 4258246737899187e-20 * e + .9631986466686816 : e >= 1e3 && e < 1e4 ? o = 4.524955218319218e-15 * l - 1.3574865654957657e-10 * t + 16776318594785756e-22 * e + .9768335918418527 : e >= 1e4 && e < 1e5 ? o = 3.8133e-8 * e + .98418 : e >= 1e5 && (o = 2.4267e-9 * e + .98775);
        return o > 1 && (o = 1), o
    }

    static solveGP(e, l, t) {
        let o = new CommonLanguageHelper, a = new MonopoleLanguageHelper, n = "";
        if (e > 0 && l > 0) {
            let o = 0;
            e > 600 && e <= 1200 ? o = 1 : e > 1200 && e <= 2500 ? o = 2 : e > 2500 && (o = 3);
            let s = 299792.458 / e, r = s / l, u = 10;
            if (r >= u) {
                let e = this.vf_monopole(r), l = .25 * s * e, a = .25 * s * e * 1.1;
                n = LocaleUtils.formatLength(l, t, o) + ";" + LocaleUtils.formatLength(a, t, o)
            } else clearResult(), n = a.CALC_ALERT2
        } else clearResult(), n = o.CALC_ALERT;
        return n
    }
}

class MonopoleLanguageHelper {
    constructor() {
        this.lng = document.documentElement.lang, "en-gb" == this.lng ? (this.CAL_ALERT1 = "Wire diameter too small!", this.CALC_ALERT2 = "Wire diameter is too large!") : (this.CALC_ALERT1 = "Діаметр дрота замалий!", this.CALC_ALERT2 = "Діаметр дрота завеликий!")
    }
}