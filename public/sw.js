if(!self.define){let e,c={};const s=(s,t)=>(s=new URL(s+".js",t).href,c[s]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=c,document.head.appendChild(e)}else e=s,importScripts(s),c()})).then((()=>{let e=c[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(t,n)=>{const _=e||("document"in self?document.currentScript.src:"")||location.href;if(c[_])return;let o={};const a=e=>s(e,_),r={module:{uri:_},exports:o,require:a};c[_]=Promise.all(t.map((e=>r[e]||a(e)))).then((e=>(n(...e),o)))}}define(["./workbox-7b405d62"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/USYD_Capstone_Project_CS01/_next/server/middleware-build-manifest.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/server/middleware-react-loadable-manifest.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/server/next-font-manifest.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/server/next-font-manifest.json",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/IFJL0pcCR3KCdZ_24k3GT/_buildManifest.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/IFJL0pcCR3KCdZ_24k3GT/_ssgManifest.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/0b7b90cd.6a44c42605c5160b.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/1308.bb9ec32ffc97ea20.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/1352.cbb80c2244789435.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/1591.52a40a9a922b01bc.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/1639.98f905ba9900cab6.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/1795.056a4f1a525d56ed.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/2242-e5bd1c5955e3ba6b.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/2575-6477f1ecb88a277c.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/29107295-54c46f60208f68c8.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/3287.63a5334b58b206a3.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/3681-8cf32d9a2bf54ef6.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/3952.42631867ab92481e.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/397.befdb8104b93468e.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/3983.b858f65458188545.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/4265-916aa8cd22864479.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/4503.aed3306954f55bb1.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/4689-5c0c58b5b2ec69a8.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/4740-7f1c2e5917a7d0d4.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/5016.85c22328d7557f1b.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/5045-9f8315422c90d26e.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/5114.200e48abc6f70218.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/5236.bd39da60f9e66084.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/5413-8cb277d28592c687.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/5567-fc0169d3d3950057.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/5715.d313d321a37fd08d.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/5912.e6e75817ceb48301.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/6409-40b04ad99bcb9fc0.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/6476.67d76448558b3744.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/6668.4474a54a9b1a78f0.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/6746.66108be8c6117d21.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/6984.93ea4a940f364269.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/7112840a-01a95e3a87775526.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/7129.bbafd98de2c709e3.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/72-d6b135ba3c305ee9.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/7200.6850cec88e9e2777.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/7561.edeb7c0d788ac4a2.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/762.6f0a1f809bf54877.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/7666-0c6fb00d80a07d43.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/8158.562c0ac2b5b0dfaf.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/8272.439b943155faeb0c.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/8302.89321190f11fc4d0.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/8331.77dbb605b3922632.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/8585.53e93f21bbfea48c.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/9081.00e8287b6abc8518.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/9413-c66fdaac2f3eeb60.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/a198fdd9-d64074b6a156193f.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/a2c2a696-6b3f226306d870d4.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/e90c0614-64ae67a83a5a75bd.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/framework-ce84985cd166733a.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/main-854ae81792ca5298.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/AboutPage-07fb0754854a760a.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/HomePage-164bdaeaf569dc66.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/IntroductionPage-cb60f2323293b972.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/MorePage-24e87510bea69989.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/Newfuc-133805130df0af41.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/PublicDisplayPage-fed62e0f1359ebfb.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/SettingPage-223f8bced50a110d.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/TestPage-ab7acc7a998f1cb4.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/_app-1c135bd51fe0f61a.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/_error-82b79221b9ed784b.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/index-62a868dd3adcddb6.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/layout-f0ca38d7f2ff4d6a.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/pages/test1-b3d9487750262ea7.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/chunks/webpack-5bb355145817a5b8.js",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/css/63886c537bbf62a1.css",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/css/6bdbcbb20425b4cb.css",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/css/b119cae7fda3629a.css",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/42d52f46a26971a3-s.woff2",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/627622453ef56b0d-s.p.woff2",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/a5b77b63ef20339c-s.woff2",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/a6d330d7873e7320-s.woff2",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/d117eea74e01de14-s.woff2",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/dfa8b99978df7bbc-s.woff2",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/eb52b768f62eeeb4-s.woff2",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/layers-2x.9859cd12.png",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/layers.ef6db872.png",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/_next/static/media/marker-icon.d577052a.png",revision:"IFJL0pcCR3KCdZ_24k3GT"},{url:"/USYD_Capstone_Project_CS01/android-chrome-192x192.png",revision:"411449f01be12def71ad57bb160831c9"},{url:"/USYD_Capstone_Project_CS01/android-chrome-512x512.png",revision:"85d1e8e6bad4868d7ae785ce2bc8c9c3"},{url:"/USYD_Capstone_Project_CS01/apple-touch-icon.png",revision:"14893e16aac85097571899610ae6a0b4"},{url:"/USYD_Capstone_Project_CS01/favicon-16x16.png",revision:"b130cf80c578601514ee308e2b4596e5"},{url:"/USYD_Capstone_Project_CS01/favicon-32x32.png",revision:"4a744902e99aad9532470ef3755d265b"},{url:"/USYD_Capstone_Project_CS01/favicon.ico",revision:"8abd63cc43f5c1bf0b8c6a9fe84ee574"},{url:"/USYD_Capstone_Project_CS01/icons/HHRI logo.png",revision:"c77bfb05f84bfcc950d88256619c46cf"},{url:"/USYD_Capstone_Project_CS01/icons/HomePage.webp",revision:"15b5d22482f6e2303c5f6b60cc34c11f"},{url:"/USYD_Capstone_Project_CS01/icons/Map.webp",revision:"87c51d365b25c2ab1d4a67ed86efc94c"},{url:"/USYD_Capstone_Project_CS01/icons/Setting.webp",revision:"c6ddb22ecaa1b5cbc4858a903dc3c118"},{url:"/USYD_Capstone_Project_CS01/icons/ac.png",revision:"a75f690b28bbf839cb0ef6e60b466b0f"},{url:"/USYD_Capstone_Project_CS01/icons/alone.png",revision:"74c1b54b479d3bb378861c61934e79a5"},{url:"/USYD_Capstone_Project_CS01/icons/android-chrome-192x192.png",revision:"411449f01be12def71ad57bb160831c9"},{url:"/USYD_Capstone_Project_CS01/icons/android-chrome-512x512.png",revision:"85d1e8e6bad4868d7ae785ce2bc8c9c3"},{url:"/USYD_Capstone_Project_CS01/icons/apple-touch-icon.png",revision:"14893e16aac85097571899610ae6a0b4"},{url:"/USYD_Capstone_Project_CS01/icons/blinds.png",revision:"c9211157b04cce981fbd7c53ff7d4dae"},{url:"/USYD_Capstone_Project_CS01/icons/comorbidity.png",revision:"11d757cb9f05c3b3a2562e4f36356a40"},{url:"/USYD_Capstone_Project_CS01/icons/evaporative.png",revision:"a36651d22174d7335addb67aaf6fbe24"},{url:"/USYD_Capstone_Project_CS01/icons/fan.png",revision:"c311518fbc61a94e2e7986cf5fa9d04c"},{url:"/USYD_Capstone_Project_CS01/icons/favicon-16x16.png",revision:"b130cf80c578601514ee308e2b4596e5"},{url:"/USYD_Capstone_Project_CS01/icons/favicon-32x32.png",revision:"4a744902e99aad9532470ef3755d265b"},{url:"/USYD_Capstone_Project_CS01/icons/favicon.ico",revision:"8abd63cc43f5c1bf0b8c6a9fe84ee574"},{url:"/USYD_Capstone_Project_CS01/icons/gazebo.png",revision:"cce2df1101fe25abbaa9b35ef620ad99"},{url:"/USYD_Capstone_Project_CS01/icons/grandparents.png",revision:"0e8159963037017aad8ae8ccec69a44f"},{url:"/USYD_Capstone_Project_CS01/icons/healthy-adults.png",revision:"11d2dfc6afe0d625f35adcf78f686ae5"},{url:"/USYD_Capstone_Project_CS01/icons/healthy-older-adults, pregnant-women, children.png",revision:"43b9184bb5f2dd6538df865295e468e7"},{url:"/USYD_Capstone_Project_CS01/icons/healthy.png",revision:"3445f1c71456cdf16f5e1b22887e7be3"},{url:"/USYD_Capstone_Project_CS01/icons/ice-cubes.png",revision:"8cfaea44db7c7ba47d9e9fdc2b997664"},{url:"/USYD_Capstone_Project_CS01/icons/lounger.png",revision:"f91d0ebecee3e8cf9cffa9544e70323c"},{url:"/USYD_Capstone_Project_CS01/icons/maps-and-flags.png",revision:"1d740ad2a3dca0d7abd45e65739b3d0e"},{url:"/USYD_Capstone_Project_CS01/icons/misting_fan.png",revision:"17162b964c017f7f7b725ea08de70c39"},{url:"/USYD_Capstone_Project_CS01/icons/no-running.png",revision:"b5ba61676afe7f6c601160ec27fce571"},{url:"/USYD_Capstone_Project_CS01/icons/pause.png",revision:"5fd50fe6bd9d9f9740032d6900a4d212"},{url:"/USYD_Capstone_Project_CS01/icons/people-with-chronic-illnesses.png",revision:"11d757cb9f05c3b3a2562e4f36356a40"},{url:"/USYD_Capstone_Project_CS01/icons/pharmacy.png",revision:"f77b67b18df0d3fca106d6ce2ab3056f"},{url:"/USYD_Capstone_Project_CS01/icons/photo.png",revision:"487c4fbaf08c4ecd7c9f284dc4c7656e"},{url:"/USYD_Capstone_Project_CS01/icons/shirt.png",revision:"d8cda24d2d2439bace9b478a57924c39"},{url:"/USYD_Capstone_Project_CS01/icons/slush-drink.png",revision:"08673deb6499fb7299f1e3b93698564d"},{url:"/USYD_Capstone_Project_CS01/icons/spray.png",revision:"8f5aac394af02ec9c654cfc2152d278d"},{url:"/USYD_Capstone_Project_CS01/icons/squeeze.png",revision:"1b17394be49751552c371c95e9ffe082"},{url:"/USYD_Capstone_Project_CS01/icons/stop.png",revision:"f4b8858f18acf647c3c87f616554689e"},{url:"/USYD_Capstone_Project_CS01/icons/tank-top.png",revision:"337687966020fa033803a2662b88cf85"},{url:"/USYD_Capstone_Project_CS01/icons/tshirt.png",revision:"c42396d07441d6bc7dbd8b449c436add"},{url:"/USYD_Capstone_Project_CS01/icons/usyd-logo.png",revision:"972113c77eb3fa910084464b03bea967"},{url:"/USYD_Capstone_Project_CS01/icons/ventilation.png",revision:"e8c16418a8b4112b7577b8b0bd7fda82"},{url:"/USYD_Capstone_Project_CS01/icons/vulnerable.png",revision:"43b9184bb5f2dd6538df865295e468e7"},{url:"/USYD_Capstone_Project_CS01/icons/vulnerable_alter.png",revision:"119a19067bda7c419bdff91473b85f0b"},{url:"/USYD_Capstone_Project_CS01/icons/vulnerable_heat.png",revision:"49d5c96cbd242e40c85bf58965f804f7"},{url:"/USYD_Capstone_Project_CS01/icons/vulnerable_new.png",revision:"7896faa6294efb0e75a0c248a29f1ebc"},{url:"/USYD_Capstone_Project_CS01/icons/warm-water.png",revision:"fcf5c20bfc0978e9c41c11019610983f"},{url:"/USYD_Capstone_Project_CS01/icons/water-bottle.png",revision:"0d61c68579587314aa0b673f55fc5220"},{url:"/USYD_Capstone_Project_CS01/icons/water.png",revision:"ce376aeb7a500769c1a14f6f07d16e03"},{url:"/USYD_Capstone_Project_CS01/leaflet/images/marker-icon-2x.png",revision:"401d815dc206b8dc1b17cd0e37695975"},{url:"/USYD_Capstone_Project_CS01/leaflet/images/marker-icon.png",revision:"2273e3d8ad9264b7daa5bdbf8e6b47f8"},{url:"/USYD_Capstone_Project_CS01/leaflet/images/marker-shadow.png",revision:"44a526eed258222515aa21eaffd14a96"},{url:"/USYD_Capstone_Project_CS01/manifest.json",revision:"824ac388e1cde30ca409658e294a35a7"},{url:"/USYD_Capstone_Project_CS01/new_data.json",revision:"a4d1dd35aceb09f723407d1f520476eb"},{url:"/USYD_Capstone_Project_CS01/postcodes.csv",revision:"49b652ce040b1955e80cef4aa96e429f"},{url:"/USYD_Capstone_Project_CS01/postcodes.json",revision:"6c03e37864d20c6a772c3614af6ee2c8"},{url:"/USYD_Capstone_Project_CS01/settingOption.json",revision:"86d916a3f879939b51ebc2dbe291deef"},{url:"/USYD_Capstone_Project_CS01/test.py",revision:"dc4b793d38eea772b69473e28396b7b7"},{url:"/USYD_Capstone_Project_CS01/tips/ageGroupTips.json",revision:"d4dba0dd080a57a03d1f957a12071149"},{url:"/USYD_Capstone_Project_CS01/tips/allGeneralTips.json",revision:"3593337bfecb2a6fb10875d7545c7625"},{url:"/USYD_Capstone_Project_CS01/tips/detailedRecommendationTips.json",revision:"eb4b8ce1ea4075873031d34328df817d"},{url:"/USYD_Capstone_Project_CS01/tips/generalTips.json",revision:"6973700aca6f51c71250411633b40ec0"},{url:"/USYD_Capstone_Project_CS01/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/USYD_Capstone_Project_CS01",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:c,event:s,state:t})=>c&&"opaqueredirect"===c.type?new Response(c.body,{status:200,statusText:"OK",headers:c.headers}):c}]}),"GET"),e.registerRoute(/.*/,new e.CacheFirst({cacheName:"app-cache",plugins:[new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
