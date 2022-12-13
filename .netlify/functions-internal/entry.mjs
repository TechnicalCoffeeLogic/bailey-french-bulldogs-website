import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { escape } from 'html-escaper';
/* empty css                                    *//* empty css                                 */import { toHTML } from '@portabletext/to-html';
/* empty css                                    */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

const ASTRO_VERSION = "1.6.10";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLBytes extends Uint8Array {
}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  }
});
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
async function* unescapeChunksAsync(iterable) {
  for await (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    code: 1e3
  },
  StaticRedirectNotAllowed: {
    code: 3001,
    message: "Redirects are only available when using output: 'server'. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  SSRClientAddressNotAvailableInAdapter: {
    code: 3002,
    message: (adapterName) => `Astro.clientAddress is not available in the ${adapterName} adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    code: 3003,
    message: "Astro.clientAddress is only available when using output: 'server'. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    code: 3004,
    message: (pathName) => `A getStaticPaths route pattern was matched, but no matching static path was found for requested path ${pathName}.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    code: 3005,
    message: (route, returnedValue) => `Route ${route ? route : ""} returned a ${returnedValue}. Only a Response can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    code: 3006,
    message: (componentName) => `Media query not provided for "client:media" directive. A media query similar to <${componentName} client:media="(max-width: 600px)" /> must be provided`
  },
  NoMatchingRenderer: {
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render ${componentName}!

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${componentName}.` : `No valid renderer was found ${componentExtension ? `for the .${componentExtension} file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `${componentName} component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by ${rendererName}!`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    code: 3009,
    message: (componentName) => `Unable to render ${componentName}! When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass client:only="${probableRenderers}"? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidStaticPathParam: {
    code: 3010,
    message: (paramType) => `Invalid params given to getStaticPaths path. Expected an object, got ${paramType}`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    code: 3011,
    message: (returnType) => `Invalid type returned by getStaticPaths. Expected an array, got ${returnType}`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsDeprecatedRSS: {
    code: 3012,
    message: "The RSS helper has been removed from getStaticPaths! Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    code: 3013,
    message: "Missing or empty required params property on getStaticPaths route",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    code: 3014,
    message: (key, value) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected a string or number, received \`${typeof value}\` ("${value}")`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    code: 3015,
    message: "getStaticPaths() function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    code: 3016,
    message: (slotName) => `Unable to create a slot named "${slotName}". ${slotName}" is a reserved slot name! Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    code: 3018,
    message: (componentName) => `Could not render ${componentName}. No matching import has been found for ${componentName}.`,
    hint: "Please make sure the component is properly imported."
  },
  UnknownCSSError: {
    code: 4e3
  },
  CSSSyntaxError: {
    code: 4001
  },
  UnknownViteError: {
    code: 5e3
  },
  FailedToLoadModuleSSR: {
    code: 5001,
    message: (importName) => `Could not import "${importName}".`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    code: 5002,
    message: (globPattern) => `Invalid glob pattern: "${globPattern}". Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownMarkdownError: {
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    code: 6001
  },
  UnknownConfigError: {
    code: 7e3
  },
  ConfigNotFound: {
    code: 7001,
    message: (configFile) => `Unable to resolve --config "${configFile}"! Does the file exist?`
  },
  ConfigLegacyKey: {
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: "${legacyConfigKey}".`,
    hint: "Please update your configuration to the new format!\nSee https://astro.build/config for more information."
  },
  UnknownError: {
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, message, stack, location, hint, frame } = props;
    this.code = code;
    if (name) {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.code)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    var _a;
    this.code = errorCode;
    this.name = ((_a = getErrorDataByCode(this.code)) == null ? void 0 : _a.name) ?? "UnknownError";
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError({
              ...AstroErrorData.MissingMediaQueryDirective,
              message: AstroErrorData.MissingMediaQueryDirective.message(displayName)
            });
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}, route) {
  var _a, _b;
  Component = await Component ?? Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } = await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2 ? slotInstructions2.map((instr) => stringifyChunk(result, instr)).join("") : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$Astro$j = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/Footer.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer class="bg-white">
  <div class="mx-auto max-w-7xl overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
    <nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
      
      <div class="px-5 py-2">
        <a href="/" class="text-base text-gray-500 hover:text-gray-900">Home</a>
      </div>

      <div class="px-5 py-2">
        <a href="/available-puppies" class="text-base text-gray-500 hover:text-gray-900">Available Puppies</a>
      </div>

      <div class="px-5 py-2">
        <a href="/faq" class="text-base text-gray-500 hover:text-gray-900">FAQ</a>
      </div>

      <div class="px-5 py-2">
        <a href="/about-us" class="text-base text-gray-500 hover:text-gray-900">About Us</a>
      </div>      

      <div class="px-5 py-2">
        <a href="/blog" class="text-base text-gray-500 hover:text-gray-900">Blog</a>
      </div>

      <div class="px-5 py-2">
        <a href="/contact-us" class="text-base text-gray-500 hover:text-gray-900">Contact</a>
      </div>
      
      <div class="px-5 py-2">
        <a href="https://forms.gle/f2WhAvXhw3NMLJ1x6" class="text-base text-gray-500 hover:text-gray-900">Questionaire</a>
      </div>

    </nav>
    <div class="mt-8 flex justify-center space-x-6">
      <a href="https://www.facebook.com/baileyfrenchbulldogs" class="text-bailey-50 hover:text-gray-500">
        <span class="sr-only">Facebook</span>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
        </svg>
      </a>
    </div>
    <p class="mt-6 text-center text-base text-gray-400">
      Bailey French Bulldogs
    </p>
    <p class="text-center text-base text-bailey-50">
      Family Dogs For Dog Families
    </p>
  </div>
  <div class="flex justify-center pb-4">
    <a href="#" class="text-center text-base hover:text-indigo-600">
      Convirs Web-Design ⚡
    </a>
  </div>
</footer>`;
});

const $$Astro$i = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/Nav.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Nav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Nav;
  return renderTemplate`${maybeRenderHead($$result)}<div class="fixed w-full z-10 top-0 bg-gray-50 astro-RWVV35MS">
  <div class="relative bg-white shadow astro-RWVV35MS">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 astro-RWVV35MS">
      <div class="flex items-center justify-between py-4 md:justify-start md:space-x-10 astro-RWVV35MS">
        <div class="flex justify-start lg:w-0 lg:flex-1 astro-RWVV35MS">
          <a href="/" class="astro-RWVV35MS">
            <span class="sr-only astro-RWVV35MS">Bailey French Bulldogs</span>
            <img class="h-10 w-auto sm:h-16 astro-RWVV35MS" src="/Bailey-logo.svg" alt="">
          </a>
        </div>
        <div class="-my-2 -mr-2 md:hidden astro-RWVV35MS">
          <button type="button" class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hamburger astro-RWVV35MS" aria-expanded="false">
            <span class="sr-only astro-RWVV35MS">Open menu</span>
            <!-- Heroicon name: outline/bars-3 -->
            <svg class="h-6 w-6 astro-RWVV35MS" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" class="astro-RWVV35MS"></path>
            </svg>
          </button>
        </div>
        <nav class="hidden space-x-10 md:flex astro-RWVV35MS">
          <a href="/available-puppies" class="text-base font-medium text-gray-500 hover:text-gray-900 astro-RWVV35MS">Available Puppies</a>          
          <a href="/faq" class="text-base font-medium text-gray-500 hover:text-gray-900 astro-RWVV35MS">FAQ</a>
          <a href="/about-us" class="text-base font-medium text-gray-500 hover:text-gray-900 astro-RWVV35MS">About Us</a>
          <a href="/blog" class="text-base font-medium text-gray-500 hover:text-gray-900 astro-RWVV35MS">Blog</a>
          <a href="/contact-us" class="text-base font-medium text-gray-500 hover:text-gray-900 astro-RWVV35MS">Contact</a>
          <a href="https://forms.gle/f2WhAvXhw3NMLJ1x6" class="text-base font-medium text-gray-500 hover:text-gray-900 astro-RWVV35MS">Questionaire</a>
        </nav>
      </div>
    </div>

    <!--
        Mobile menu, show/hide based on mobile menu state.
  
        Entering: "duration-200 ease-out"
          From: "opacity-0 scale-95"
          To: "opacity-100 scale-100"
        Leaving: "duration-100 ease-in"
          From: "opacity-100 scale-100"
          To: "opacity-0 scale-95"
      -->
    <div class="fixed inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden nav-links hidden animate-open-menu astro-RWVV35MS">
      <div class="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 astro-RWVV35MS">
        <div class="px-5 pt-5 pb-6 astro-RWVV35MS">
          <div class="flex items-center justify-between astro-RWVV35MS">
            <a href="/" class="astro-RWVV35MS">
              <img class="h-10 w-auto astro-RWVV35MS" src="/Bailey-logo.svg" alt="Bailey French BullDogs">
            </a>
            <div class="-mr-2 astro-RWVV35MS">
              <button type="button" class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 close astro-RWVV35MS">
                <span class="sr-only astro-RWVV35MS">Close menu</span>
                <!-- Heroicon name: outline/x-mark -->
                <svg class="h-6 w-6 astro-RWVV35MS" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" class="astro-RWVV35MS"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-6 astro-RWVV35MS">
            <nav class="grid gap-y-8 astro-RWVV35MS">
              <a href="/available-puppies" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50 astro-RWVV35MS">
                <span class="ml-3 text-base font-medium text-gray-900 astro-RWVV35MS">Available Puppies</span>
              </a>

              <a href="/faq" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50 astro-RWVV35MS">
                <span class="ml-3 text-base font-medium text-gray-900 astro-RWVV35MS">FAQ</span>
              </a>

              <a href="/about-us" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50 astro-RWVV35MS">
                <span class="ml-3 text-base font-medium text-gray-900 astro-RWVV35MS">About Us</span>
              </a>

              <a href="/blog" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50 astro-RWVV35MS">
                <span class="ml-3 text-base font-medium text-gray-900 astro-RWVV35MS">Blog</span>
              </a>

              <a href="/contact-us" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50 astro-RWVV35MS">
                <span class="ml-3 text-base font-medium text-gray-900 astro-RWVV35MS">Contact</span>
              </a>

              <a href="https://forms.gle/f2WhAvXhw3NMLJ1x6" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50 astro-RWVV35MS">
                <span class="ml-3 text-base font-medium text-gray-900 astro-RWVV35MS">Questionaire</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

`;
});

const $$Astro$h = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/layouts/Layout.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, metaDesc, ogType = "website" } = Astro2.props;
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>
    <meta name="description"${addAttribute(metaDesc, "content")}>
    <meta property="og:title"${addAttribute(title, "content")}>
    <meta property="og:description"${addAttribute(metaDesc, "content")}>
    <meta property="og:image" content="/Bailey-logo.svg">
    <meta property="og:type"${addAttribute(ogType, "content")}>
    <title>${title}</title>
  ${renderHead($$result)}</head>
  <body class="bg-gray-100">
    ${renderComponent($$result, "Nav", $$Nav, {})}
    ${renderSlot($$result, $$slots["default"])}
    ${renderComponent($$result, "Footer", $$Footer, {})}
    
    ${maybeRenderHead($$result)}
  </body>
</html>`;
});

const $$Astro$g = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/yellow-button.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$YellowButton = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$YellowButton;
  const { buttonText, href } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div class="mt-4 sm:mt-0 text-center">
    <a${addAttribute(href, "href")} class="block w-full rounded-md border border-transparent bg-bailey-50 px-5 py-3 text-base font-medium text-white shadow hover:bg-bailey-100 focus:outline-none focus:ring-2 focus:ring-bailey-50 focus:ring-offset-2 sm:px-10">${buttonText}</a>
  </div>`;
});

const $$Astro$f = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/black-button.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$BlackButton = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$BlackButton;
  const { buttonText, href } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div class="mt-4 sm:mt-0 sm:ml-3">
  <a${addAttribute(href, "href")} class="block w-full rounded-md border border-transparent bg-gray-700 px-5 py-3 text-base font-medium text-white shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-bailey-50 focus:ring-offset-2 sm:px-10">${buttonText}</a>
</div>`;
});

const $$Astro$e = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/Hero.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead($$result)}<div class="relative bg-gray-50">
  <div class="lg:relative">
    <div class="mx-auto w-full max-w-7xl pt-8 pb-10 text-center lg:py-48 lg:text-left">
      <div class="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          <span class="block xl:inline">Family Dogs For</span>
          <span class="block text-bailey-50 xl:inline">Dog Families</span>
        </h1>
        <p class="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
          A Frenchie family for over 10 years.
        </p>
        <div class="mt-10 sm:flex sm:justify-center lg:justify-start">
          <div class="sm:flex sm:w-full sm:max-w-lg w-100"> 
            ${renderComponent($$result, "YellowButton", $$YellowButton, { "buttonText": "Get Puppy Info.", "href": "/contact-us" })}
            ${renderComponent($$result, "BlackButton", $$BlackButton, { "buttonText": "Available Puppies", "href": "/available-puppies" })}
          </div>
        </div>
      </div>
    </div>
    <div class="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
      <img class="absolute inset-0 h-full w-full object-cover" src="/hero-image.jpg" alt="sleeping french bulldog puppies">
    </div>
  </div>
</div>`;
});

const $$Astro$d = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/blurb.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Blurb = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Blurb;
  return renderTemplate`${maybeRenderHead($$result)}<div class="bg-white">
  <div class="mx-auto max-w-7xl py-16 px-4 sm:py-16 sm:px-6 lg:px-8">
    <div class="text-center">
      <p class="mt-1 text-4xl font-bold tracking-tight text-bailey-50 sm:text-5xl lg:text-6xl">
        Bailey French Bulldogs
      </p>
      <p class="mx-auto mt-5 max-w-xl text-xl text-gray-500">
        Breeding and raising AKC registered Frenchies <span class="text-bailey-50">in-home</span> as part of our family.
      </p>
    </div>
  </div>
</div>`;
});

const $$Astro$c = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/Testamonials.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Testamonials = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Testamonials;
  return renderTemplate`${maybeRenderHead($$result)}<div class="bg-white">
    <div class="mx-auto max-w-7xl py-12 px-4 text-center sm:px-6 lg:px-8">
      <div class="space-y-12">
        <div class="space-y-1 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl ">Why People Love</h2>
          <p class="text-3xl font-bold tracking-tight sm:text-4xl text-bailey-50">Bailey French Bulldogs</p>          
        </div>
        <ul role="list" class="mx-auto space-y-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:space-y-0 lg:max-w-5xl lg:grid-cols-3">
          <li>
            <div class="space-y-6">
              <img class="mx-auto h-40 w-40 rounded-full xl:h-56 xl:w-56" src="/taylor.jpg" alt="">
              <div class="space-y-2">
                <div class="space-y-1 text-lg font-medium leading-6">
                    <h3 class=" font-bold">Taylor S.</h3>
                    <p class=" text-bailey-50 font-light">“These people are the sweetest, most kind people I have dealt with. They responded immediately and always offered helpful information. They still check up on my sweet Frenchie”</p>
                </div>
              </div>
            </div>
          </li>
  
          <!-- More people... -->
          <li>
            <div class="space-y-6">
              <img class="mx-auto h-40 w-40 rounded-full xl:h-56 xl:w-56" src="/chelsea.jpg" alt="">
              <div class="space-y-2">
                <div class="space-y-1 text-lg font-medium leading-6">
                  <h3 class=" font-bold">Chelsea L.</h3>
                  <p class="text-bailey-50 font-light">“After sifting through scammers, I happened across Bailey’s French Bulldogs and was over the moon! I quickly inquired about one and received a timely response as well as even a phone call while they were on vacation! After an awesome talk on the phone and explaining my family to her, Brittany set me up with the most perfect little boy! She always kept me well updated and made this process so amazing. I couldn’t have asked for a better breeder or pup!! We are so in love with our new boy!”</p>
                </div>                
              </div>
            </div>
          </li>

          <!-- -->
          <li>
            <div class="space-y-6">
              <img class="mx-auto h-40 w-40 rounded-full xl:h-56 xl:w-56" src="/heidi.jpg" alt="">
              <div class="space-y-2">
                <div class="space-y-1 text-lg font-medium leading-6">
                  <h3 class="font-bold">Heidi P.</h3>
                  <p class="text-bailey-50 font-light">“Brittany was great to work with. She answered all my questions and even did a video chat so we could get a feel for the puppies personalities. It was very clear that she places a high importance on the homes she chooses for her babies. Thank you for our new family member!”</p>
                </div>                
              </div>
            </div>
          </li>

        </ul>
      </div>
    </div>
  </div>`;
});

const $$Astro$b = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/Contact.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Contact;
  return renderTemplate`${maybeRenderHead($$result)}<div class="overflow-hidden bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 lg:py-24">
    <div class="relative mx-auto max-w-xl">      
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl text-bailey-50">Contact us</h2>
        <p class="mt-4 text-lg leading-6 text-gray-500">We would love to hear from you! Please complete the contact form or email baileyfrenchbulldogs@gmail.com and we will get in touch with you soon. Have a great day!
        </p>
      </div>
      <div class="mt-12">
        <form action="#" class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8" id="contact-us">
          <div>
            <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
            <div class="mt-1">
              <input type="text" name="first-name" id="first-name" value="" autocomplete="given-name" class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-bailey-50 focus:ring-bailey-50">
            </div>
          </div>
          <div>
            <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
            <div class="mt-1">
              <input type="text" name="last-name" id="last-name" value="" autocomplete="family-name" class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-bailey-50 focus:ring-bailey-50">
            </div>
          </div>         
          <div class="sm:col-span-2">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <div class="mt-1">
              <input id="email" name="email" type="email" value="" autocomplete="email" class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-bailey-50 focus:ring-bailey-50">
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <div class="relative mt-1 rounded-md shadow-sm">             
              <select name="subject" id="subject" class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-bailey-50 focus:ring-bailey-50">
                <option>Available Puppies</option>
                <option>Price information</option>
                <option>More Information About Bailey French Bulldogs</option>
              </select>
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <div class="mt-1">
              <textarea id="message" name="message" rows="4" class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-bailey-50 focus:ring-bailey-50"></textarea>
            </div>
          </div>          
          <div class="sm:col-span-2">
            <button type="submit" class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-bailey-50 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-bailey-100 focus:outline-none focus:ring-2 focus:ring-bailey-50 focus:ring-offset-2">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>`;
});

const $$Astro$a = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/index.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Bailey French Bulldogs - breeding family French Bulldogs for dog families.", "metaDesc": "A Frenchie family for over 10 years that breeds family French Bulldogs for dog families.", "class": "astro-BORJ6HEY" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="main-grid astro-BORJ6HEY">
    <div class="hero astro-BORJ6HEY">
      ${renderComponent($$result, "Hero", $$Hero, { "class": "astro-BORJ6HEY" })}
    </div>
    <div class="blurb astro-BORJ6HEY">
      ${renderComponent($$result, "Blurb", $$Blurb, { "class": "astro-BORJ6HEY" })}
    </div>
    <div class="testamonials astro-BORJ6HEY">
      ${renderComponent($$result, "Testamonials", $$Testamonials, { "class": "astro-BORJ6HEY" })}
    </div>
    <div class="contact astro-BORJ6HEY">
      ${renderComponent($$result, "Contact", $$Contact, { "class": "astro-BORJ6HEY" })}
    </div>
  </main>` })}
${maybeRenderHead($$result)}

`;
});

const $$file$7 = "C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/index.astro";
const $$url$7 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$7,
  url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

const PROJECT_ID = "2t63ykhm";
const DATASET = "production";

const $$Astro$9 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/puppy-card.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$PuppyCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$PuppyCard;
  const { name, source, birthday, color, mom, dad } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<li class="bg-white pt-10 list-none">
  <div class="flex flex-col items-center w-100">
    <p class="text-2xl font-bold mb-5 tracking-tight">${name}</p>
    <img class="h-48 w-48 rounded-full xl:h-56 xl:w-56 mb-5"${addAttribute(source, "src")}${addAttribute(name, "alt")}>
    <div class="w-100 flex flex-col text-gray-500">
      <p>Birthday: ${birthday}</p>
      <p>Color: ${color}</p>
      <p>Mom: ${mom}</p>
      <p>Dad: ${dad}</p>
    </div>
    <div class="sm:mt-5">
      ${renderComponent($$result, "YellowButton", $$YellowButton, { "buttonText": "Get Puppy Info.", "href": "/contact-us" })}
    </div>
    <hr class="my-5 sm:w-96 w-full">
  </div>
</li>`;
});

const $$Astro$8 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/breeding-dog-card.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$BreedingDogCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$BreedingDogCard;
  const { name, source, age, color, gender, ownedBy, website } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<li class="bg-white pt-10 list-none">
  <div class="flex flex-col items-center w-100">
    <p class="text-2xl font-bold mb-5 tracking-tight">${name}</p>
    <img class="h-48 w-48 rounded-full xl:h-56 xl:w-56 mb-5"${addAttribute(source, "src")}${addAttribute(name, "alt")}>
    <div class="w-100 flex flex-col text-gray-500">
      <p>Age: ${age}</p>
      <p>Color: ${color}</p>      
      <p>Gender: ${gender}</p>
      <p>Owner: ${ownedBy}</p>
      <a${addAttribute(website, "href")} target="_blank" class=" underline text-bailey-50">${website}</a>
    </div>
    <hr class="my-5 sm:w-96 w-full">
  </div>
</li>`;
});

const $$Astro$7 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/available-puppies.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$AvailablePuppies = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$AvailablePuppies;
  const PUPPIES_QUERY = encodeURIComponent(`*[_type == "puppy"]`);
  const BREEDING_DOGS_QUERY = encodeURIComponent(`*[_type == "breedingDogs"]`);
  const PUPPIES_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${PUPPIES_QUERY}`;
  const BREEDING_DOGS_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${BREEDING_DOGS_QUERY}`;
  let puppyArray = [];
  let breedingDogsArray = [];
  try {
    let response = await fetch(PUPPIES_URL);
    let result = await response.json();
    if (result !== null) {
      let puppies = result;
      for (let puppy of puppies.result) {
        let pup = {};
        pup.birthday = puppy.birthday;
        pup.color = puppy.color;
        pup.dad = puppy.dad;
        pup.mom = puppy.mom;
        pup.name = puppy.puppyName;
        let tmpSrc = puppy.puppyPicture?.asset?._ref;
        tmpSrc = tmpSrc.replace("image-", "");
        tmpSrc = tmpSrc.replace("-jpg", ".jpg");
        pup.pic = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${tmpSrc}`;
        puppyArray.push(pup);
      }
    }
  } catch (err) {
    console.error(err);
  }
  try {
    let response = await fetch(BREEDING_DOGS_URL);
    let result = await response.json();
    if (result !== null) {
      let breedingDogsResult = result;
      for (let breedingDog of breedingDogsResult.result) {
        let tmpDog = breedingDog;
        let dog = {};
        dog.age = tmpDog.age;
        dog.color = tmpDog.color;
        dog.gender = tmpDog.gender;
        dog.name = tmpDog.name;
        dog.ownedBy = tmpDog.ownedBy;
        dog.website = tmpDog.website;
        let tmpSrc = tmpDog.picture?.asset?._ref;
        if (tmpSrc) {
          tmpSrc = tmpSrc?.replace("image-", "");
          tmpSrc = tmpSrc?.replace("-jpg", ".jpg");
          dog.pic = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${tmpSrc}`;
        }
        breedingDogsArray.push(dog);
      }
    }
  } catch (err) {
    console.error(err);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Availble frenchie puppies from Bailey French Bulldogs.", "metaDesc": "Take a sneek peak at our available Frenchies and fall in love with you new French Bulldog family member." }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main>
    <div class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <section>
          <div class="text-center">
            <h1 class="mt-1 text-3xl font-bold tracking-tight sm:text-4xl text-bailey-50">
              Available Puppies
            </h1>
            <ul>
              ${puppyArray.map((pup) => renderTemplate`${renderComponent($$result, "PuppyCard", $$PuppyCard, { "name": pup.name, "source": pup.pic, "birthday": pup.birthday, "color": pup.color, "mom": pup.mom, "dad": pup.dad })}`)}
            </ul>            
          </div>
        </section>

        <section class=" pt-10">
          <div class="text-center">
            <h1 class="mt-1 text-3xl font-bold tracking-tight sm:text-4xl text-bailey-50">
              Breeding Dogs
            </h1>
            <ul>
              ${breedingDogsArray.map((dog) => renderTemplate`${renderComponent($$result, "BreedingDogCard", $$BreedingDogCard, { "name": dog.name, "source": dog.pic, "age": dog.age, "color": dog.color, "gender": dog.gender, "ownedBy": dog.ownedBy, "website": dog.website })}`)}
            </ul>
          </div>
        </section>
      </div>
    </div>
  </main>` })}`;
});

const $$file$6 = "C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/available-puppies.astro";
const $$url$6 = "/available-puppies";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AvailablePuppies,
  file: $$file$6,
  url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$6 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/contact-us.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$ContactUs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ContactUs;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact Bailey French Bulldogs. A dog breeder who breeds family French Bulldogs for dog families.", "metaDesc": "Contact Bailey French Bulldogs to talk to us personally and learn about our French Bulldog puppies." }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="mt-16">
    ${renderComponent($$result, "Contact", $$Contact, {})}

    <div class="bg-gray-50 flex justify-center flex-col sm:flex-row items-center">
      <div class="sm:pr-20 pb-10 sm:pb-20 flex">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
        </svg>
        <p class="pl-1">baileyfrenchbulldogs@gmail.com</p>
      </div>
      <div class="pb-20 flex text-bailey-50">
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
        </svg>
        <a href="https://www.facebook.com/baileyfrenchbulldogs" class="text-bailey-50 underline pl-1">Message us on Facebook</a>
      </div>
    </div>
  </main>` })}

${maybeRenderHead($$result)}`;
});

const $$file$5 = "C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/contact-us.astro";
const $$url$5 = "/contact-us";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ContactUs,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const myPortableTextComponents = {
    types: {
        image: ({value}) => {
            let tmpImage = value;
            let image = "";
            let tmpSrc = tmpImage.asset?._ref;
            if (tmpSrc) {
                tmpSrc = tmpSrc.replace("image-", "");
                tmpSrc = tmpSrc.replace("-jpg", ".jpg");
                image = `<div class=" flex w-100 flex-col justify-center content-center items-center">
                            <img src="https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${tmpSrc}" class=" rounded-lg"/>
                        </div>`;
            }
            return image;
        },
        break: () => {
            return `<br/><hr/><br/>`
        },
    },
};

const $$Astro$5 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/blog-post/[...slug].astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  const SLUG_QUERY = encodeURIComponent(
    `*[_type=="post" && slug.current == "${slug}"]`
  );
  const SLUG_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${SLUG_QUERY}`;
  let post = {};
  let resp;
  let title = "Blog";
  let shortDesc = "Short Desc.";
  try {
    let response = await fetch(SLUG_URL);
    resp = await response.json();
    let firstTime = false;
    for (let data of resp.result) {
      if (data.title) {
        post.title = data.title;
        title = post.title;
      }
      if (data.shortDesc) {
        shortDesc = data.shortDesc;
      }
      if (data.body) {
        for (let child of data.body) {
          let text = child;
          let tempText = toHTML(text, {
            components: myPortableTextComponents
          });
          if (tempText == "<p></p>" || tempText == "") {
            post.body += "<br/>";
          } else {
            post.body += tempText;
          }
        }
        post.body = post.body?.replace("undefined", "");
      }
      if (data.mainImage?.asset?._ref) {
        let tmpSrc = data.mainImage.asset._ref;
        tmpSrc = tmpSrc.replace("image-", "");
        tmpSrc = tmpSrc.replace("-jpg", ".jpg");
        post.image = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${tmpSrc}`;
      }
      let authorID = data.author?._ref;
      let AUTHOR_QUERY = encodeURIComponent(
        `*[_type=="author" && _id=="${authorID}"]`
      );
      let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${AUTHOR_QUERY}`;
      let authorResp = await fetch(URL);
      let authorResult = await authorResp.json();
      post.author = authorResult.result[0].name;
    }
  } catch (err) {
    console.error(err);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "metaDesc": shortDesc, "ogType": "article" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="bg-white">
    <section class="mx-auto max-w-7xl py-24 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col">
        <h1 class="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          ${post.title}
        </h1>
        <p class="block text-center text-lg font-semibold text-bailey-50">
          ${post.author}
        </p>
        <div class="w-full flex justify-center py-4">
          <img${addAttribute(post.image, "src")} class="rounded-lg">
        </div>
        <article class="mx-auto mt-6 text-gray-500">${unescapeHTML(post.body)}</article>
      </div>
    </section>
  </main>` })}

${maybeRenderHead($$result)}`;
});

const $$file$4 = "C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/blog-post/[...slug].astro";
const $$url$4 = "/blog-post/[...slug]";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$4 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/about-us.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$AboutUs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$AboutUs;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Learn about Bailey French Bulldogs. A dog breeder who breeds family French Bulldogs for dog families.", "metaDesc": "We are the Baileys, we raise AKC registered French Bulldogs. Our mamas and babies are raised in our home as part of our family.", "class": "astro-GQVJADB5" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="astro-GQVJADB5">
    <div class="bg-white astro-GQVJADB5">
      <div class="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8 astro-GQVJADB5">
        <div class="text-center astro-GQVJADB5">
          <h1 class="mt-1 text-3xl font-bold tracking-tight sm:text-4xl text-bailey-50 astro-GQVJADB5">
            The Bailey Family
          </h1>
          <p class="mx-auto mt-5 max-w-xl text-lg text-gray-500 astro-GQVJADB5">
            Hello! We are the Baileys, we raise AKC registered French Bulldogs.
            Our <span class="text-bailey-50 astro-GQVJADB5">mamas and babies are raised in our home as part of our family.</span>
            They snuggle us on the couch, join us for family walks, play outside
            with our children, and eat like royalty. We want to be a blessing to
            the world, and we have been blessed by Frenchies. We have had
            Frenchies for 10+ years and love their quirkiness and their big dog
            personalities. Who can resist those bat ears?
          </p>
        </div>
      </div>
    </div>

    <!--family -->
    <div class="bg-white astro-GQVJADB5">
      <div class="mx-auto max-w-7xl py-4 px-4 text-center sm:px-6 lg:px-8 lg:py-12 astro-GQVJADB5">
        <div class="space-y-12 astro-GQVJADB5">
          <ul role="list" class="mx-auto space-y-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:space-y-0 lg:max-w-5xl lg:grid-cols-3 astro-GQVJADB5">
            
            <li class="astro-GQVJADB5">
              <div class="space-y-6 astro-GQVJADB5">
                <img class="mx-auto h-40 w-40 rounded-full xl:h-56 xl:w-56 astro-GQVJADB5" src="./zach-and-brittany-web.jpg" alt="">
                <div class="space-y-2 astro-GQVJADB5">
                  <div class="space-y-1 text-lg font-medium leading-6 astro-GQVJADB5">
                    <h3 class="font-bold astro-GQVJADB5">
                      Zach and Brittany <br class="astro-GQVJADB5"> Bailey
                    </h3>
                  </div>
                </div>
              </div>
            </li>

            <!-- More people... -->
            <li class="astro-GQVJADB5">
              <div class="space-y-6 astro-GQVJADB5">
                <img class="mx-auto h-40 w-40 rounded-full xl:h-56 xl:w-56 astro-GQVJADB5" src="./sons-web.jpg" alt="">
                <div class="space-y-2 astro-GQVJADB5">
                  <div class="space-y-1 text-lg font-medium leading-6 astro-GQVJADB5">
                  </div>
                </div>
              </div>
            </li>

            <!-- -->
            <li class="astro-GQVJADB5">
              <div class="space-y-6 astro-GQVJADB5">
                <img class="mx-auto h-40 w-40 rounded-full xl:h-56 xl:w-56 astro-GQVJADB5" src="./daughter-web.jpg" alt="">
                <div class="space-y-2 astro-GQVJADB5">
                  <div class="space-y-1 text-lg font-medium leading-6 astro-GQVJADB5">
                  </div>
                </div>
              </div>
            </li>

            <!-- -->
            <li class="astro-GQVJADB5">
              <div class="space-y-6 astro-GQVJADB5">
                <img class="mx-auto h-40 w-40 rounded-full xl:h-56 xl:w-56 astro-GQVJADB5" src="./ahsoka-web.jpg" alt="">
                <div class="space-y-2 astro-GQVJADB5">
                  <div class="space-y-1 text-lg font-medium leading-6 astro-GQVJADB5">
                    <h3 class="font-bold astro-GQVJADB5">Ahsoka</h3>
                    <p class="text-bailey-50 font-light astro-GQVJADB5">Dam</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class=" mt-5 sm:w-100 sm:flex sm:justify-center astro-GQVJADB5">
            ${renderComponent($$result, "YellowButton", $$YellowButton, { "buttonText": "View Available Puppies", "href": "/available-puppies", "class": "astro-GQVJADB5" })}
          </div>
        </div>
      </div>
    </div>
  </main>` })}

`;
});

const $$file$3 = "C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/about-us.astro";
const $$url$3 = "/about-us";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AboutUs,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/components/Blog-Card.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$BlogCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$BlogCard;
  const { title, author, date, imageSrc, authorImageSrc, shortDesc, slug } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-col overflow-hidden rounded-lg shadow-lg">
    <a${addAttribute(`/blog-post/${slug}`, "href")} class="mt-2 block">
        <div class="flex-shrink-0">
            <img class="h-48 w-full object-cover"${addAttribute(imageSrc, "src")} alt="">
        </div>
        <div class="flex flex-1 flex-col justify-between bg-white p-6 hover:bg-slate-200">
            <div class="flex-1">
                <p class="text-xl font-semibold text-gray-900">
                    ${title}
                </p>
                <p class="mt-3 text-base text-gray-500">
                    ${shortDesc}
                </p>
            </div>
            <div class="mt-6 flex items-center">
                <div class="flex-shrink-0">
                    <img class="h-10 w-10 rounded-full"${addAttribute(authorImageSrc, "src")}${addAttribute(author, "alt")}>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">${author}</p>
                    <div class="flex space-x-1 text-sm text-gray-500">
                        <time datetime="2020-03-16">${date}</time>
                    </div>
                </div>
            </div>
        </div>
    </a>
</div>`;
});

const $$Astro$2 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/blog.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Blog;
  let posts = [];
  const PROJECT_ID = "2t63ykhm";
  const DATASET = "production";
  const POST_QUERY = encodeURIComponent('*[_type == "post"]');
  const POST_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${POST_QUERY}`;
  try {
    let response = await fetch(POST_URL);
    let resp = await response.json();
    for (let singlePost of resp.result) {
      let post = {};
      post.title = singlePost.title;
      post.shortDesc = singlePost.shortDesc;
      post.slug = singlePost.slug.current;
      post.date = new Date(singlePost.publishedAt).toLocaleDateString("en-us", {
        weekday: "long",
        month: "long",
        day: "numeric"
      });
      let tmpSrc = singlePost.mainImage.asset._ref;
      tmpSrc = tmpSrc.replace("image-", "");
      tmpSrc = tmpSrc.replace("-jpg", ".jpg");
      post.imageSrc = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${tmpSrc}`;
      let authorID = singlePost.author._ref;
      let AUTHOR_QUERY = encodeURIComponent(
        `*[_type=="author" && _id=="${authorID}"]`
      );
      let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${AUTHOR_QUERY}`;
      let authorResp = await fetch(URL);
      let authorResult = await authorResp.json();
      post.author = authorResult.result[0].name;
      let tmpAuthorImageSrc = authorResult.result[0].image.asset._ref;
      tmpAuthorImageSrc = tmpAuthorImageSrc.replace("image-", "");
      tmpAuthorImageSrc = tmpAuthorImageSrc.replace("-jpg", ".jpg");
      post.authorImageSrc = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${tmpAuthorImageSrc}`;
      posts.push(post);
    }
  } catch (error) {
    console.error(error);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "The Bailey Bullblog", "metaDesc": " Our musings on French Bulldogs." }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="pt-16">
    <div class="relative bg-white px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div class="absolute inset-0">
        <div class="h-1/3 bg-white sm:h-2/3"></div>
      </div>
      <div class="relative mx-auto max-w-7xl">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-bailey-50 sm:text-4xl">
          The Bailey Bullblog
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Our musings on French Bulldogs
          </p>
        </div>
        <div class="mx-auto mt-12 grid max-w-lg gap-5">
          ${posts.map((post) => renderTemplate`${renderComponent($$result, "BlogCard", $$BlogCard, { "title": post.title, "author": post.author, "date": post.date, "imageSrc": post.imageSrc, "authorImageSrc": post.authorImageSrc, "shortDesc": post.shortDesc, "slug": post.slug })}`)}
        </div>
      </div>
    </div>
  </main>` })}

${maybeRenderHead($$result)}`;
});

const $$file$2 = "C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/blog.astro";
const $$url$2 = "/blog";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/test.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Test = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Test;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Bailey French Bulldogs" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="relative bg-gray-50">
		<main class="lg:relative">
			<div class="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
				<div class="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
					<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
						<span class="block xl:inline">Family Dogs For</span>
						<span class="block text-yellow-600 xl:inline">Dog Families</span>
					</h1>
					<p class="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
						A Frenchie family for over 10 years
					</p>
					<div class="mt-10 sm:flex sm:justify-center lg:justify-start">
						<div class="rounded-md shadow">
							<a href="#" class="flex w-full items-center justify-center rounded-md border border-transparent bg-yellow-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg">Get Puppy Information</a>
						</div>
					</div>
				</div>
			</div>
			<div class="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
				<img class="absolute inset-0 h-full w-full object-cover" src="/hero-image.jpg" alt="">
			</div>
		</main>
	</div>` })}`;
});

const $$file$1 = "C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/test.astro";
const $$url$1 = "/test";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Test,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/faq.astro", "", "file:///C:/Users/trevo/source/bailey-french-bulldogs-website/");
const $$Faq = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Faq;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Frequenty asked questions (FAQ) about Bailey French Bulldogs who breed family French Bulldogs for dog families.", "metaDesc": "Frequently asked questions answered. Get to know how breed and how we love our Frenchies" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="pt-16">
    <div class="bg-white">
      <div class="mx-auto max-w-7xl py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl divide-y-2 divide-gray-200">
          <h1 class="text-center text-3xl font-bold tracking-tight text-bailey-50 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <dl class="mt-6 space-y-6 divide-y divide-gray-200">
            <div class="flex items-center">
              <div class="mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
              </div>
              <div class="pt-6">
                <dt class="text-lg">
                  <span class="text-gray-900 font-bold">Is there genetic testing done on puppies and parents?
                  </span>
                </dt>
                <dd class="mt-2 pr-12" id="faq-0">
                  <p class="text-base text-gray-500">
                    For each litter, both parents are DNA tested. We would be
                    happy to discuss their testing with you after a
                    questionnaire is sent in. We do not do genetic testing on
                    puppies
                  </p>
                </dd>
              </div>
            </div>
            <!-- More questions... -->

            <div class="flex items-center">
              <div class="mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
              </div>
              <div class="pt-6">
                <dt class="text-lg">
                  <span class="text-gray-900 font-bold">Are there updated pictures after a deposit is put down for
                    a puppy?
                  </span>
                </dt>
                <dd class="mt-2 pr-12" id="faq-0">
                  <p class="text-base text-gray-500">
                    Yes! I want you to be excited about the puppy that will be
                    coming home with you soon. I try to send as many pictures as
                    I can.
                  </p>
                </dd>
              </div>
            </div>
            <!-- More questions... -->

            <div class="flex items-center">
              <div class="mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
              </div>
              <div class="pt-6">
                <dt class="text-lg">
                  <span class="text-gray-900 font-bold">What food are the puppies on?
                  </span>
                </dt>
                <dd class="mt-2 pr-12" id="faq-0">
                  <p class="text-base text-gray-500">
                    Our puppies are familiar with Taste of the Wild Puppy
                    Formula. We suggest that puppies stay on this food because
                    of the great quality.
                  </p>
                </dd>
              </div>
            </div>
            <!-- More questions... -->

            <div class="flex items-center">
              <div class="mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                </svg>
              </div>
              <div class="pt-6">
                <dt class="text-lg">
                  <span class="text-gray-900 font-bold">Are our puppies good with children?
                  </span>
                </dt>
                <dd class="mt-2 pr-12" id="faq-0">
                  <p class="text-base text-gray-500">
                    Yes! From the time our puppies are born they are immediately
                    around small children. Since our puppies are raised in our
                    home our children take a very active role in raising them.
                  </p>
                </dd>
              </div>
            </div>
            <!-- More questions... -->
          </dl>
        </div>
      </div>
      <div class="mt-5 sm:w-100 sm:flex sm:justify-center p-5">
        ${renderComponent($$result, "YellowButton", $$YellowButton, { "buttonText": "View Available Puppies", "href": "/available-puppies" })}
      </div>
    </div>
  </main>` })}`;
});

const $$file = "C:/Users/trevo/source/bailey-french-bulldogs-website/src/pages/faq.astro";
const $$url = "/faq";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/available-puppies.astro', _page1],['src/pages/contact-us.astro', _page2],['src/pages/blog-post/[...slug].astro', _page3],['src/pages/about-us.astro', _page4],['src/pages/blog.astro', _page5],['src/pages/test.astro', _page6],['src/pages/faq.astro', _page7],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/about-us.ce669d7d.css","assets/index.c1caddc8.css"],"scripts":[{"type":"external","value":"hoisted.b31c3896.js"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about-us.ce669d7d.css"],"scripts":[{"type":"external","value":"hoisted.fd0e4c82.js"}],"routeData":{"route":"/available-puppies","type":"page","pattern":"^\\/available-puppies\\/?$","segments":[[{"content":"available-puppies","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/available-puppies.astro","pathname":"/available-puppies","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about-us.ce669d7d.css"],"scripts":[{"type":"external","value":"hoisted.b31c38962.js"}],"routeData":{"route":"/contact-us","type":"page","pattern":"^\\/contact-us\\/?$","segments":[[{"content":"contact-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact-us.astro","pathname":"/contact-us","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about-us.ce669d7d.css"],"scripts":[{"type":"external","value":"hoisted.fd0e4c822.js"}],"routeData":{"route":"/blog-post/[...slug]","type":"page","pattern":"^\\/blog-post(?:\\/(.*?))?\\/?$","segments":[[{"content":"blog-post","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/blog-post/[...slug].astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about-us.ce669d7d.css","assets/about-us.435504a9.css"],"scripts":[{"type":"external","value":"hoisted.fd0e4c824.js"}],"routeData":{"route":"/about-us","type":"page","pattern":"^\\/about-us\\/?$","segments":[[{"content":"about-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about-us.astro","pathname":"/about-us","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about-us.ce669d7d.css"],"scripts":[{"type":"external","value":"hoisted.fd0e4c823.js"}],"routeData":{"route":"/blog","type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about-us.ce669d7d.css"],"scripts":[{"type":"external","value":"hoisted.fd0e4c824.js"}],"routeData":{"route":"/test","type":"page","pattern":"^\\/test\\/?$","segments":[[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/test.astro","pathname":"/test","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about-us.ce669d7d.css"],"scripts":[{"type":"external","value":"hoisted.fd0e4c824.js"}],"routeData":{"route":"/faq","type":"page","pattern":"^\\/faq\\/?$","segments":[[{"content":"faq","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/faq.astro","pathname":"/faq","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","/astro/hoisted.js?q=0":"hoisted.b31c3896.js","/astro/hoisted.js?q=1":"hoisted.fd0e4c82.js","/astro/hoisted.js?q=2":"hoisted.b31c38962.js","/astro/hoisted.js?q=3":"hoisted.fd0e4c822.js","/astro/hoisted.js?q=4":"hoisted.fd0e4c823.js","/astro/hoisted.js?q=5":"hoisted.fd0e4c824.js","astro:scripts/before-hydration.js":""},"assets":["/assets/about-us.435504a9.css","/assets/index.c1caddc8.css","/assets/about-us.ce669d7d.css","/about.txt","/ahsoka-web.JPG","/android-chrome-192x192.png","/android-chrome-512x512.png","/apple-touch-icon.png","/Bailey-logo.svg","/chelsea.jpg","/daughter-web.jpg","/favicon-16x16.png","/favicon-32x32.png","/favicon.ico","/heidi.jpg","/hero-image.jpg","/hoisted.b31c3896.js","/hoisted.b31c38962.js","/hoisted.fd0e4c82.js","/hoisted.fd0e4c822.js","/hoisted.fd0e4c823.js","/hoisted.fd0e4c824.js","/site.webmanifest","/sons-web.jpg","/taylor.jpg","/zach-and-brittany-web.jpg","/chunks/contact-us.939e6397.js","/chunks/nav.8c615f46.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler };
