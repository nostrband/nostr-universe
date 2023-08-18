import {
  coracleIcon,
  irisIcon,
  nostrIcon,
  satelliteIcon,
  snortIcon,
} from "../../assets";

export const BASE_URL = "https://api.nostr.band/v0";

export const DEFAULT_PUBKEY = "anon";

export const DEFAULT_APPS = [
  {
    naddr:
      "naddr1qqqnqq3qsx9rnd03vs34lp39fvfv5krwlnxpl90f3dzuk8y3cuwutk2gdhdqxpqqqp70vh7mzgu",
    name: "Nostr.Band",
    picture: nostrIcon,
    url: "https://nostr.band/",
    about: "Search and discovery on Nostr",
    kinds: [0, 1, 30023],
    handlers: {
      0: { url: "https://nostr.band/<bech32>" },
      1: { url: "https://nostr.band/<bech32>" },
      30023: { url: "https://nostr.band/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qq9kzurs94c8ymmxd9kx2q3qsn0rtcjcf543gj4wsg7fa59s700d5ztys5ctj0g69g2x6802npjqxpqqqp70veq8u55",
    name: "Snort",
    picture: snortIcon,
    url: "https://snort.social/",
    about: "Feature packed nostr web client",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://snort.social/p/<bech32>" },
      1: { url: "https://snort.social/e/<bech32>", type: "nevent" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5mnyvec8qungvenqgsrx4k7vxeev3unrn5ty9qt9w4cxlsgzrqw752mh6fduqjgqs9chhgrqsqqql8ks78ejl",
    name: "Iris",
    picture: irisIcon,
    url: "https://iris.to/",
    about: "Iris app ⚡️ The Nostr client for better social networks",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://iris.to/<bech32>" },
      1: { url: "https://iris.to/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5unvwps8yenvwfsqgsf03c2gsmx5ef4c9zmxvlew04gdh7u94afnknp33qvv3c94kvwxgsrqsqqql8kylym66",
    name: "Coracle",
    picture: coracleIcon,
    url: "https://coracle.social/",
    about:
      "An experimental Nostr client focused on unlocking the full potential of multiple relays. Browse, filter, zap, and create custom feeds to create a curated Nostr experience.",
    kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985],
    handlers: {
      0: { url: "https://coracle.social/<bech32>" },
      1: { url: "https://coracle.social/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5unxdehx56rgwfkqgs07f7srjc72ma4skqrqmrm5a4mqdalyyw9k4eu2mjwwr9gtp644uqrqsqqql8kj9hy6d",
    name: "Satellite",
    picture: satelliteIcon,
    url: "https://satellite.earth/",
    about:
      "Satellite is a nostr web client with a reddit-like interface optimized for conversation threads. Includes a media-hosting service with the ability to upload files up to 5GB.",
    kinds: [0, 1],
    handlers: {
      0: { url: "https://satellite.earth/@<bech32>" },
      1: { url: "https://satellite.earth/thread/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5urqvf3xserqdenqgsgrz3ekhckgg6lscj5kyk2tph0enqljh5ck3wtrjguw8w9m9yxmksrqsqqql8kvwe43l",
    name: "Nostr Apps",
    picture: "https://nostrapp.link/logo.png",
    url: "https://nostrapp.link/",
    about: "Find new Nostr apps, publish apps, switch between apps.",
    kinds: [0, 30117, 31990],
    handlers: {
      0: { url: "https://nosta.me/p/<bech32>" },
      30117: { url: "https://nosta.me/r/<bech32>" },
      31990: { url: "https://nosta.me/a/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cxccrvdfhxg6nyd3nqgs8fzl6slzr0v55zex30p9nyjsd962ftjpx3cqyfc78094rk9vvnkqrqsqqql8krf899y",
    name: "Zapddit",
    picture: "https://zapddit.com/assets/icons/logo-without-text-zapddit.svg",
    url: "https://zapddit.com/",
    about:
      "Hey there👋 I am zapddit, a reddit-style #nostr client with a fresh outlook on #nostr - Follow topics, not just people.",
    kinds: [1],
    handlers: {
      1: { url: "https://zapddit.com/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cxc6n2d33xymrvwpeqgsp9z7qt2n06ssaqrpuxwyn98eeelr4pvp4mdkd45htp7vrhl6k98crqsqqql8kc4575h",
    name: "Nosta",
    picture: "https://nosta.me/images/apple-icon-120x120.png",
    url: "https://nosta.me/",
    about:
      "The antidote to Nostr profile anxiety. Nosta onboards your onto the Nostr ecosystem in a few simple steps, helps you manage your profile info as you go, gives you a nice profile page with all your recent activity, and helps you find fun and interesting things to do on Nostr. Your profile is central to everything you do on Nostr, Nosta helps you set it up in the way you want it.",
    kinds: [0],
    handlers: {
      0: { url: "https://nosta.me/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5urydfcxqunzd3nqgsru22d9lfnnwck54qr4phrvey50h2q33xc0gqxv5j03ftn4efu4rsrqsqqql8kr7wmdc",
    name: "Pinstr",
    picture: "https://pinstr.app/favicon.ico",
    url: "https://pinstr.app/",
    about:
      "Pinstr is a decentralized and open-source social network for curating and sharing your interests with the world. With Pinstr, you can easily organize and discover new ideas, inspiration, and recommendations.",
    kinds: [0],
    handlers: {
      0: { url: "https://pinstr.app/p/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cxuenywfk8ycnqvenqgs86nsy2qatyes4m40jnmqgk5558jl979a6escp9vnzyr92yv4tznqrqsqqql8kdg24gq",
    name: "Habla",
    picture: "",
    url: "https://habla.news/",
    about:
      "Habla allows you to read, write, curate and monetize long form content over Nostr.",
    kinds: [0, 30023],
    handlers: {
      0: { url: "https://habla.news/p/<bech32>", type: "nprofile" },
      30023: { url: "https://habla.news/a/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5urqdpcxcmrxv34qgs0c934tdk4mmyy7pfunu6uf4fm3a2arre942gpxe096hparva47wqrqsqqql8kfg6jd0",
    name: "Listr",
    picture: "https://void.cat/d/5vVZpbmyeFfiNgZ4ayCGDy.webp",
    url: "https://listr.lol/",
    about: "The best way to create and manage Nostr lists.",
    kinds: [0, 30000, 30001],
    handlers: {
      0: { url: "https://listr.lol/<bech32>" },
      3: { url: "https://listr.lol/a/<bech32>" },
      30000: { url: "https://listr.lol/a/<bech32>" },
      30001: { url: "https://listr.lol/a/<bech32>" },
    },
  },
  {
    naddr:
      "naddr1qqxnzd3cx5urqv3exgmrsdenqgs8834mjfzq4y6yy70h5d428hshzry3nzc7n69rjnx38cxatjv5cccrqsqqql8ktxa4yy",
    name: "Highlighter",
    picture: "https://void.cat/d/8cvy6d6VHYx6F7MBQ8DJLn.webp",
    url: "https://highlighter.com/",
    about: "Information yearns to be free. And addressable. by @PABLOF7z",
    kinds: [0, 9802],
    handlers: {
      0: { url: "https://highlighter.com/p/<bech32>" },
      9802: { url: "https://highlighter.com/e/<bech32>" },
    },
  },
];
