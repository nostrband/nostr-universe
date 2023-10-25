/* eslint-disable */
// @ts-nocheck
import { coracleIcon, irisIcon, nostrIcon, satelliteIcon, snortIcon } from '@/assets'
import { DEFAULT_PUBKEY } from '@/consts'
import { db, dbi } from '@/modules/db'
import { keystore } from '@/modules/keystore'
import { addWalletInfo, setNsbSigner, subscribeProfiles } from '@/modules/nostr'
import { walletstore } from '@/modules/walletstore'
import { setCurrentPubkey, setKeys, setReadKeys, setNsbKeys } from '@/store/reducers/keys.slice'
import { addTabs } from '@/store/reducers/tab.slice'
import { addWorkspaces } from '@/store/reducers/workspaces.slice'
import { DEFAULT_CONTENT_FEED_SETTINGS } from '@/types/content-feed'
import { WorkSpace } from '@/types/workspace'
import { getOrigin } from '@/utils/helpers/prepare-data'
import { v4 as uuidv4 } from 'uuid'

// ?? зачем дефолтные аппы ??
const defaultApps = [
  {
    naddr: 'naddr1qqxnzd3cx5urqvf3xserqdenqgsgrz3ekhckgg6lscj5kyk2tph0enqljh5ck3wtrjguw8w9m9yxmksrqsqqql8kvwe43l',
    name: 'Nostr Apps',
    picture: 'https://nostrapp.link/logo.png',
    url: 'https://nostrapp.link/',
    about: 'Find new Nostr apps, publish apps, switch between apps.',
    kinds: [0, 31990],
    urls: [
      { url: 'https://nosta.me/p/<bech32>', type: 'npub' },
      { url: 'https://nosta.me/a/<bech32>', type: 'naddr' }
    ]
  },
  {
    naddr: 'naddr1qqqnqq3qsx9rnd03vs34lp39fvfv5krwlnxpl90f3dzuk8y3cuwutk2gdhdqxpqqqp70vh7mzgu',
    name: 'Nostr',
    picture: nostrIcon,
    url: 'https://nostr.band/',
    about: 'Search and discovery on Nostr',
    kinds: [0, 1, 30023],
    urls: [
      { url: 'https://nostr.band/<bech32>', type: 'npub' },
      { url: 'https://nostr.band/<bech32>', type: 'note' },
      { url: 'https://nostr.band/<bech32>', type: 'naddr' }
    ]
  },
  {
    naddr: 'naddr1qq9kzurs94c8ymmxd9kx2q3qsn0rtcjcf543gj4wsg7fa59s700d5ztys5ctj0g69g2x6802npjqxpqqqp70veq8u55',
    name: 'Snort',
    picture: snortIcon,
    url: 'https://snort.social/',
    about: 'Feature packed nostr web client',
    kinds: [0, 1],
    urls: [
      { url: 'https://snort.social/p/<bech32>', type: 'npub' },
      { url: 'https://snort.social/e/<bech32>', type: 'nevent' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3cx5mnyvec8qungvenqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8ks78ejl',
    name: 'Iris',
    picture: irisIcon,
    url: 'https://iris.to/',
    about: 'Iris app ⚡️ The Nostr client for better social networks',
    kinds: [0, 1],
    urls: [
      { url: 'https://iris.to/<bech32>', type: 'npub' },
      { url: 'https://iris.to/<bech32>', type: 'note' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3cx5unvwps8yenvwfsqgsf03c2gsmx5ef4c9zmxvlew04gdh7u94afnknp33qvv3c94kvwxgsrqsqqql8kylym66',
    name: 'Coracle',
    picture: coracleIcon,
    url: 'https://coracle.social/',
    about:
      'An experimental Nostr client focused on unlocking the full potential of multiple relays. Browse, filter, zap, and create custom feeds to create a curated Nostr experience.',
    kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985],
    urls: [
      { url: 'https://coracle.social/<bech32>', type: 'npub' },
      { url: 'https://coracle.social/<bech32>', type: 'note' },
      { url: 'https://coracle.social/<bech32>', type: 'naddr' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3cx5unxdehx56rgwfkqgs07f7srjc72ma4skqrqmrm5a4mqdalyyw9k4eu2mjwwr9gtp644uqrqsqqql8kj9hy6d',
    name: 'Satellite',
    picture: satelliteIcon,
    url: 'https://satellite.earth/',
    about:
      'Satellite is a nostr web client with a reddit-like interface optimized for conversation threads. Includes a media-hosting service with the ability to upload files up to 5GB.',
    kinds: [0, 1],
    urls: [
      { url: 'https://satellite.earth/@<bech32>', type: 'npub' },
      { url: 'https://satellite.earth/thread/<bech32>', type: 'note' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3cxccrvdfhxg6nyd3nqgs8fzl6slzr0v55zex30p9nyjsd962ftjpx3cqyfc78094rk9vvnkqrqsqqql8krf899y',
    name: 'Zapddit',
    picture: 'https://zapddit.com/assets/icons/logo-without-text-zapddit.svg',
    url: 'https://zapddit.com/',
    about:
      'Hey there👋 I am zapddit, a reddit-style #nostr client with a fresh outlook on #nostr - Follow topics, not just people.',
    kinds: [1],
    urls: [{ url: 'https://zapddit.com/<bech32>', type: 'npub' }]
  },
  {
    naddr: 'naddr1qqxnzd3cxc6n2d33xymrvwpeqgsp9z7qt2n06ssaqrpuxwyn98eeelr4pvp4mdkd45htp7vrhl6k98crqsqqql8kc4575h',
    name: 'Nosta',
    picture: 'https://nosta.me/images/apple-icon-120x120.png',
    url: 'https://nosta.me/',
    about:
      'The antidote to Nostr profile anxiety. Nosta onboards your onto the Nostr ecosystem in a few simple steps, helps you manage your profile info as you go, gives you a nice profile page with all your recent activity, and helps you find fun and interesting things to do on Nostr. Your profile is central to everything you do on Nostr, Nosta helps you set it up in the way you want it.',
    kinds: [0],
    urls: [{ url: 'https://nosta.me/<bech32>', type: 'npub' }]
  },
  {
    naddr: 'naddr1qqxnzd3cx5urydfcxqunzd3nqgsru22d9lfnnwck54qr4phrvey50h2q33xc0gqxv5j03ftn4efu4rsrqsqqql8kr7wmdc',
    name: 'Pinstr',
    picture: 'https://pinstr.app/assets/pinstr.svg',
    url: 'https://pinstr.app/',
    about:
      'Pinstr is a decentralized and open-source social network for curating and sharing your interests with the world. With Pinstr, you can easily organize and discover new ideas, inspiration, and recommendations.',
    kinds: [0],
    urls: [{ url: 'https://pinstr.app/p/<bech32>', type: 'npub' }]
  },
  {
    naddr: 'naddr1qqxnzd3cxuenywfk8ycnqvenqgs86nsy2qatyes4m40jnmqgk5558jl979a6escp9vnzyr92yv4tznqrqsqqql8kdg24gq',
    name: 'Habla',
    picture: 'https://habla.news/favicon.png',
    url: 'https://habla.news/',
    about: 'Habla allows you to read, write, curate and monetize long form content over Nostr.',
    kinds: [0, 30023],
    urls: [
      { url: 'https://habla.news/p/<bech32>', type: 'nprofile' },
      { url: 'https://habla.news/a/<bech32>', type: 'naddr' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3cx5urqdpcxcmrxv34qgs0c934tdk4mmyy7pfunu6uf4fm3a2arre942gpxe096hparva47wqrqsqqql8kfg6jd0',
    name: 'Listr',
    picture: 'https://void.cat/d/5vVZpbmyeFfiNgZ4ayCGDy.webp',
    url: 'https://listr.lol/',
    about: 'The best way to create and manage Nostr lists.',
    kinds: [0, 30000, 30001],
    urls: [
      { url: 'https://listr.lol/<bech32>', type: 'npub' },
      { url: 'https://listr.lol/a/<bech32>', type: 'naddr' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3cx5urqv3exgmrsdenqgs8834mjfzq4y6yy70h5d428hshzry3nzc7n69rjnx38cxatjv5cccrqsqqql8ktxa4yy',
    name: 'Highlighter',
    picture: 'https://void.cat/d/8cvy6d6VHYx6F7MBQ8DJLn.webp',
    url: 'https://highlighter.com/',
    about: 'Information yearns to be free. And addressable. by @PABLOF7z',
    kinds: [0, 9802],
    urls: [
      { url: 'https://highlighter.com/p/<bech32>', type: 'npub' },
      { url: 'https://highlighter.com/e/<bech32>', type: 'note' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3cxccrvd34xser2dpkqgszv6q4uryjzr06xfxxew34wwc5hmjfmfpqn229d72gfegsdn2q3fgrqsqqql8kyuj9ug',
    name: 'noStrudel',
    picture: 'https://nostrudel.ninja/apple-touch-icon.png',
    url: 'https://nostrudel.ninja/',
    about: 'A simple web based nostr client focused on exploring nostr',
    kinds: [0, 1, 30000, 30001, 30030, 30311, 34550],
    urls: [
      { url: 'https://nostrudel.ninja/#/u/<bech32>', type: 'npub' },
      { url: 'https://nostrudel.ninja/#/u/<bech32>', type: 'nprofile' },
      { url: 'https://nostrudel.ninja/#/n/<bech32>', type: 'note' },
      { url: 'https://nostrudel.ninja/#/n/<bech32>', type: 'nevent' },
      { url: 'https://nostrudel.ninja/#/l/<bech32>', type: 'naddr' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3exc6nqdfexvcrqde3qgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8k9596qe',
    name: 'Zephyr',
    picture: 'https://image.nostr.build/e0c3dbd9fc2111f04428ce2e9e7b058ba7346cc12238bfbb5747b97d583a491a.png',
    url: 'https://zephyr.coracle.social/',
    about:
      'Slow down and meditate on what your friends are saying. Embrace inefficiency. Internalize, invent, understand, remember.'
  },
  {
    naddr: 'naddr1qqxnzd3excerydpcxu6n2dfsqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8kdu5r0z',
    name: 'Nostatus',
    picture: 'https://nostatus.vercel.app//android-chrome-192x192.png',
    url: 'https://nostatus.vercel.app/',
    about: "Nostr client for browsing your friends' status."
  },
  {
    naddr: 'naddr1qqxnzd3ex5unywf3xyenjd33qgsdxm5qs0a8kdk6aejxew9nlx074g7cnedrjeggws0sq03p4s9khmqrqsqqql8kzv7862',
    name: 'Shopstr',
    picture: 'https://shopstr.store/shopstr.ico',
    url: 'https://shopstr.store/',
    about: 'A decentralized classifieds marketplace using Lightning and Cashu.'
  },
  {
    naddr: 'naddr1qqxnzd3ex5urjdfnxy6rzwpnqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8klwwwzp',
    name: 'Oddbean',
    picture: 'https://oddbean.com/static/oddbean.svg?7b162b894c8bdf0f',
    url: 'https://oddbean.com/',
    about:
      'Oddbean is a discussion site built on the nostr protocol. You may notice that the design is heavily inspired by Hacker News and Reddit.',
    kinds: [0, 1],
    urls: [
      { url: 'https://oddbean.com/e/<bech32>', type: 'note' },
      { url: 'https://oddbean.com/u/<bech32>', type: 'npub' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3exscnsvpsxqurxdehqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8k48gnse',
    name: 'Stacker.News',
    picture: 'https://stacker.news/favicon.png',
    url: 'https://stacker.news/',
    about: "It's like Hacker News but we pay you Bitcoin"
  },
  {
    naddr: 'naddr1qqxnzd3exgurzvpjxsurwv3hqgsypwwgtll74lqu4huvxzjwtjyxvrlkujt35rw8y026ke6ttesmg5grqsqqql8kjwp3ul',
    name: 'nostree',
    picture: 'https://nostree.me/favicon.svg',
    url: 'https://nostree.me',
    about: 'A Nostr-based application to create, manage and discover link lists, and other stuff.',
    kinds: [0, 30000, 30001],
    urls: [
      { url: 'https://nostree.me/<bech32>', type: 'npub' },
      { url: 'https://nostree.me/<bech32>', type: 'nprofile' },
      { url: 'https://nostree.me/a/<bech32>', type: 'naddr' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3exscnwdf48qunjv3eqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8kqn056u',
    name: 'Mutiny Wallet',
    picture: 'https://framerusercontent.com/images/dEeAapDQU71mZTWUltiFqlZSsE.png',
    url: 'https://app.mutinywallet.com/',
    about: 'Mutiny is a self-custodial lightning wallet that runs in the browser.'
  },
  {
    naddr: 'naddr1qqxnzd3exscnwdfh8qunvwpeqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8k0wajyp',
    name: 'Alby',
    picture: 'https://getalby.com/alby_icon_yellow_128x128.png',
    url: 'https://getalby.com/',
    about:
      'Your Bitcoin & Nostr companion for the web. Connect your wallet, use Bitcoin & Nostr apps with the Alby Extension. Create an Alby Account to get a lightning wallet for payments wherever you go.'
  },
  {
    naddr: 'naddr1qqxnzd3exverzde4xyunxwf4qgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8ka7nhhr',
    name: 'Nostrrr',
    picture: '',
    url: 'https://nostrrr.com/',
    about: 'Nostr relay browser'
  },
  {
    naddr: 'naddr1qqxnzd3exvmr2wfkxccnjwpeqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8kymu3d8',
    name: 'Filestr',
    picture: '',
    url: 'https://filestr.vercel.app/',
    about: 'A nostr file explorer',
    kinds: [0, 1063],
    urls: [
      { url: 'https://filestr.vercel.app/p/<bech32>', type: 'nprofile' },
      { url: 'https://filestr.vercel.app/e/<bech32>', type: 'nevent' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3exvcnyvpkx56n2vpkqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8ku0tmyn',
    name: 'Blowater',
    picture: 'https://blowater.deno.dev/logo.png',
    url: 'https://blowater.deno.dev/',
    about: 'Blowater is a delightful Nostr client that focuses on DM.'
  },
  {
    naddr: 'naddr1qqxnzd3exgur2deh8yunqdf3qgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8kldvhed',
    name: 'NostrChat',
    picture: 'https://www.nostrchat.io/favicon.ico',
    url: 'https://www.nostrchat.io/',
    about: 'A decentralized DM and chat application',
    kinds: [0],
    urls: [{ url: 'https://www.nostrchat.io/dm/<bech32>', type: 'npub' }]
  },
  {
    naddr: 'naddr1qqxnzd3exycrwwphxgunjve4qgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8kw4vkcq',
    name: 'Primal',
    picture: 'https://primal.net/assets/favicon-66add1cc.ico',
    url: 'https://primal.net/',
    about: 'Primal is a fast Nostr web client.',
    kinds: [0, 1],
    urls: [
      { url: 'https://primal.net/p/<bech32>', type: 'npub' },
      { url: 'https://primal.net/e/<bech32>', type: 'note' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3exgmnqvfh8ymnzdekqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8ktcvhl3',
    name: 'Zapplepay',
    picture: 'https://www.zapplepay.com/favicon.ico',
    url: 'https://zapplepay.com/',
    about: "Zaps can't be stopped"
  },
  {
    naddr: 'naddr1qqxnzd3exgenxwf4xqcnyd3sqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8knxy3s7',
    name: 'Stemstr',
    picture: 'https://stemstr.app/apple-touch-icon.png',
    url: 'https://stemstr.app/',
    about: 'Where music gets made',
    kinds: [0, 1808],
    urls: [
      { url: 'https://stemstr.app/user/<bech32>', type: 'npub' },
      { url: 'https://stemstr.app/thread/<bech32>', type: 'note' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3exgenxwf4xqcnyd3sqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8knxy3s7',
    name: 'Stemstr',
    picture: 'https://stemstr.app/apple-touch-icon.png',
    url: 'https://stemstr.app/',
    about: 'Where music gets made',
    kinds: [0, 1808],
    urls: [
      { url: 'https://stemstr.app/user/<bech32>', type: 'npub' },
      { url: 'https://stemstr.app/thread/<bech32>', type: 'note' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3exgenxwphxuenjwpsqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8khly63z',
    name: 'Swarmstr',
    picture: 'https://swarmstr.com/apple-touch-icon.png',
    url: 'https://swarmstr.com/',
    about: 'Find answers to your questions. Assist others in resolving theirs.',
    kinds: [1],
    urls: [{ url: 'https://swarmstr.com/?e=<bech32>', type: 'nevent' }]
  },
  {
    naddr: 'naddr1qqxnzd3exgenxdekxymrqvfhqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8kgkpa8e',
    name: 'Zap.Stream',
    picture: 'https://zap.stream/logo.png',
    url: 'https://zap.stream/',
    about: 'Live Streaming on Nostr',
    kinds: [0, 30311],
    urls: [
      { url: 'https://zap.stream/p/<bech32>', type: 'npub' },
      { url: 'https://zap.stream/<bech32>', type: 'naddr' }
    ]
  },
  {
    naddr: 'naddr1qqxnzd3exgenxdeexvervwpnqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8k9e8lns',
    name: 'ZapLife',
    picture: '',
    url: 'https://zaplife.lol/',
    about: 'Watch zaps flow in real-time.',
    kinds: [0],
    urls: [{ url: 'https://zaplife.lol/p/<bech32>', type: 'npub' }]
  },
  {
    naddr: 'naddr1qqxnzd3exvcnyv3nxuunvdfhqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8kcnr0xx',
    name: 'FlyCat',
    picture: 'https://flycat.club/favicon.ico',
    url: 'https://flycat.club/',
    about: 'Flycat nostr client'
  },
  {
    naddr: 'naddr1qqxnzd3c8qurjvfjxq6rgde3qgswlsm7jlayltt8neryk7npssqfklx8vpdvavx97445vnftnp4xpuqrqsqqql8kpxyysn',
    name: 'nostr.kiwi',
    picture: 'https://nostr.kiwi/images/logo/rounded-512.png',
    url: 'https://nostr.kiwi/',
    about:
      'A progressive web app to share notes and curate content in communities. Compatible natively on all mobile devices.'
  },
  {
    naddr: 'naddr1qqxnzd3exycrswfjxycnxvfkqgsvt7mwejrkupzcu0k2nyvwxuxte5mkjqw9s3s9ztl9x7jxukxr3wcrqsqqql8kz23mgn',
    name: 'nosbin',
    picture: 'https://nosbin.com/logo.png',
    url: 'https://nosbin.com/',
    about:
      'nosbin allows you to quickly upload code snippets to nostr! Simply cut, paste, and post. Provides code highlighting for any language.'
  },
  {
    naddr: 'naddr1qqxnzd3exqmnjvf38qmrjwpsqgst03hkj9w04xnzllm2rupxqn0g3s3ud3kx6xu0vtrucyr5nuc8aqgrqsqqql8kcqcp4e',
    name: 'Slidestr',
    picture: 'https://slidestr.net/slidestr.svg',
    url: 'https://slidestr.net/',
    about:
      'Shows slide shows of images and videos on the nostr platform. Filter images by tags and create beautiful slide show. Also features a grid view to browse through images. Currently in BETA. Currently only shows public data, a user login is not possible yet',
    urls: [{ url: 'https://slidestr.net/p/<bech32>', type: 'npub' }]
  },
  {
    naddr: 'naddr1qqxnzd3cxcurxdpjxy6nvvp4qgsr7acdvhf6we9fch94qwhpy0nza36e3tgrtkpku25ppuu80f69kfqrqsqqql8kvt4fza',
    name: 'Nostr Nests',
    picture: 'https://nostrnests.com/img/nostrich-nest.png',
    url: 'https://nostrnests.com/',
    about: 'Nostr Nests is an audio space for chatting, brainstorming, debating, jamming, micro-conferences and more.'
  },
  {
    naddr: 'naddr1qqxnzd3exvmnqdecxgunzdp5qgspc5hteqn9fezrlyjsrd7sefjeu79htlwuh8z6vhck3my526vvj2srqsqqql8kdn9cuy',
    name: 'Relay.Guide',
    picture: '',
    url: 'https://relay.guide/',
    about: 'A tool for discovering and managing your relays'
  },
  {
    naddr: 'naddr1qqxnzd3exvcnxd34xgunqdpeqgs04xzt6ldm9qhs0ctw0t58kf4z57umjzmjg6jywu0seadwtqqc75srqsqqql8kar40zs',
    name: 'Vendata',
    picture: 'https://cdn.nostr.build/i/5405e8be436c0ed902846119f351f8898aa06ec94b51e635f0ed50d727a9fc68.png',
    url: 'https://vendata.io/',
    about: 'Client to interact with Data Vending Machines'
  },
  {
    naddr: 'naddr1qqxnzd3exscnwd3jx5erwdp4qgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8kdcm4sw',
    name: 'w3.do',
    picture: 'https://w3.do/favicon.ico',
    url: 'https://w3.do/',
    about: 'URL Shortener on NOSTR Network'
  }
]

const bootstrap = async (pubkey) => {
  console.log('new workspace', pubkey, ' bootstrapping')
  let pins = []
  defaultApps.forEach((app, ind) => {
    const pin = {
      id: '' + Math.random(),
      url: app.url,
      appNaddr: app.naddr,
      title: app.name,
      icon: app.picture,
      order: ind,
      pubkey: pubkey
    }
    pins.push(pin)
  })
  db.pins.bulkAdd(pins)
}

const ensureBootstrapped = async (workspaceKey) => {
  if (!(await dbi.getFlag(workspaceKey, 'bootstrapped'))) {
    await bootstrap(workspaceKey)
    dbi.setFlag(workspaceKey, 'bootstrapped', true)
  }
}

export const getTabGroupId = (pt) => {
  return getOrigin(pt.url) // pt.appNaddr ||
}

export const bootstrapSettings = async (pubkey) => {
  const isSettingsExist = await dbi.checkPresenceOfSettings(pubkey)

  if (!isSettingsExist) {
    console.log('Creating default ContentFeedSettings')
    await dbi.setContentFeedSettings({
      id: uuidv4(),
      pubkey,
      settings_json: DEFAULT_CONTENT_FEED_SETTINGS
    })
  }
}

export const loadWorkspace = async (pubkey: string, dispatch): Promise<void> => {
  console.log('loadWorkspace', pubkey)
  // ?? props
  await ensureBootstrapped(pubkey)

  const pins = await dbi.listPins(pubkey)
  const tabs = await dbi.listTabs(pubkey)
  const perms = await dbi.listPerms(pubkey)

  await bootstrapSettings(pubkey)

  const contentFeedSettings = (await dbi.getContentFeedSettingsByPubkey(pubkey)) || []

  console.log('perms', JSON.stringify(perms))

  const lastKindAppsCollection = await dbi.getLastKingApps(pubkey)

  console.log('workspace lastKindApps', lastKindAppsCollection)

  const pinsSort = pins.sort((a, b) => a.order - b.order)
  const tabsSort = tabs.sort((a, b) => a.order - b.order)

  const workspace: WorkSpace = {
    pubkey,
    tabIds: tabsSort.map((t) => t.id),
    pins: pinsSort,
    lastKindApps: lastKindAppsCollection,
    currentTabId: '',
    perms,
    contentFeedSettings: contentFeedSettings
  }

  dispatch(addWorkspaces({ workspaces: [workspace] }))
  dispatch(addTabs({ tabs }))

  await dbi.autoDeleteExcessSearchHistory(pubkey)
}

export const reloadWallets = async () => {
  const r = await walletstore.listWallets()
  console.log('wallets', JSON.stringify(r))
  Object.values(r)
    .filter((w) => typeof w === 'object') // exclude 'currentAlias'
    .forEach((w) => addWalletInfo(w))
}

export const writeCurrentPubkey = async (pubkey: string) => {
  await dbi.setFlag('', 'currentPubkey', pubkey)
}

export const loadKeys = async (dispatch): Promise<[keys: string[], currentPubkey: string, readKeys: string[]]> => {
  // can be writeKey or readKey
  let currentPubkey = await dbi.getFlag('', 'currentPubkey')
  console.log('currentPubkey', currentPubkey)

  // load nsb keys first
  const nsbKeyInfos = await dbi.listNsecbunkerKeys()
  const nsbKeys = nsbKeyInfos.map((k) => k.pubkey)
  console.log('nsbKeyInfos', JSON.stringify(nsbKeyInfos))

  // write-keys from native plugin
  const list = await keystore.listKeys()
  console.log('listKeys', JSON.stringify(list))

  // filter nsb keys
  const writeKeys = Object.keys(list)
    .filter((key) => key !== 'currentAlias')
    .filter((key) => !nsbKeys.includes(key))

  // read only keys from local db
  const readKeys = (await dbi.listReadOnlyKeys()).filter((k) => !writeKeys.includes(k) && !nsbKeys.includes(k))

  // merge all key types
  const keys = [...new Set([...writeKeys, ...readKeys, ...nsbKeys])]

  // ensure current pubkey is selected
  if (!currentPubkey) {
    if (keys.length) currentPubkey = keys[0]
    else currentPubkey = DEFAULT_PUBKEY
    await writeCurrentPubkey(currentPubkey)
  }

  // add default to lists
  if (currentPubkey === DEFAULT_PUBKEY && !keys.length) {
    readKeys.push(DEFAULT_PUBKEY)
    keys.push(DEFAULT_PUBKEY)
  }

  const nsbKey = nsbKeyInfos.find((i) => i.pubkey === currentPubkey)

  // ensure we select proper key in native plugin
  if (currentPubkey !== DEFAULT_PUBKEY && list.currentAlias != currentPubkey && !readKeys.includes(currentPubkey)) {
    const pubkey = nsbKey ? nsbKey.localPubkey : currentPubkey
    await keystore.selectKey({ publicKey: pubkey })
  }

  console.log(
    'load keys cur',
    currentPubkey,
    'keys',
    JSON.stringify(keys),
    'writeKeys',
    JSON.stringify(writeKeys),
    'readKeys',
    JSON.stringify(readKeys),
    'nsbKeys',
    JSON.stringify(nsbKeys)
  )

  dispatch(setKeys({ keys }))
  dispatch(setReadKeys({ readKeys }))
  dispatch(setNsbKeys({ nsbKeys }))
  dispatch(setCurrentPubkey({ currentPubkey }))

  if (nsbKey) setNsbSigner(nsbKey.token)

  return [keys, currentPubkey, readKeys, nsbKeys]
}
