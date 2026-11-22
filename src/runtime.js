/* Runtime mini untuk template Nawa Factory ERP (sc-if / sc-for / {{ lookup }}) tanpa dependensi */
class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; this.__cbs = []; }
  setState(e, cb) {
    const patch = typeof e === 'function' ? e(this.state, this.props) : e;
    if (patch) this.state = Object.assign({}, this.state, patch);
    if (cb) this.__cbs.push(cb);
    if (this.__schedule) this.__schedule();
  }
  forceUpdate() { if (this.__schedule) this.__schedule(); }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  renderVals() { return {}; }
}
const __SVG = 'http://www.w3.org/2000/svg';
const __BOOL = new Set(['disabled', 'checked', 'hidden', 'selected', 'readonly', 'required', 'multiple', 'open', 'autofocus']);
const __cache = new Map();
function __parts(str) {
  let c = __cache.get(str);
  if (c) return c;
  const whole = /^\s*\{\{\s*([\w.$-]+)\s*\}\}\s*$/.exec(str);
  if (whole) c = {whole: whole[1].split('.')};
  else if (str.indexOf('{{') < 0) c = {plain: str};
  else {
    const out = []; const re = /\{\{\s*([\w.$-]+)\s*\}\}/g; let last = 0, m;
    while ((m = re.exec(str))) { if (m.index > last) out.push(str.slice(last, m.index)); out.push(m[1].split('.')); last = re.lastIndex; }
    if (last < str.length) out.push(str.slice(last));
    c = {mix: out};
  }
  __cache.set(str, c);
  return c;
}
function __get(path, scope) {
  let v = scope[path[0]];
  for (let i = 1; i < path.length && v != null; i++) v = v[path[i]];
  return v;
}
function __txt(v) { return v == null || v === false || v === true ? '' : String(v); }
function __str(c, scope) {
  if (c.plain !== undefined) return c.plain;
  if (c.whole) return __txt(__get(c.whole, scope));
  let s = ''; for (const p of c.mix) s += typeof p === 'string' ? p : __txt(__get(p, scope));
  return s;
}
const __EVT = {onclick: 'click', onchange: 'change', oninput: 'input', ondragstart: 'dragstart', ondragover: 'dragover', ondrop: 'drop', onkeydown: 'keydown', onsubmit: 'submit', onblur: 'focusout', onfocus: 'focusin'};
function __children(node) { return node.content ? node.content.childNodes : node.childNodes; }
function __build(node, scope, out) {
  if (node.nodeType === 3) { out.push(document.createTextNode(__str(__parts(node.nodeValue), scope))); return; }
  if (node.nodeType !== 1) return;
  const sc = node.getAttribute && node.getAttribute('data-sc');
  if (sc === 'if') {
    const c = __parts(node.getAttribute('value') || '');
    const v = c.whole ? __get(c.whole, scope) : c.plain;
    if (v) for (const ch of __children(node)) __build(ch, scope, out);
    return;
  }
  if (sc === 'for') {
    const c = __parts(node.getAttribute('list') || ''), as = node.getAttribute('as') || 'item';
    const list = c.whole ? __get(c.whole, scope) : null;
    if (list && list.length) {
      const kids = __children(node);
      for (let i = 0; i < list.length; i++) { const s2 = Object.create(scope); s2[as] = list[i]; s2.index = i; for (const ch of kids) __build(ch, s2, out); }
    }
    return;
  }
  const ns = node.namespaceURI;
  const el = ns === __SVG ? document.createElementNS(__SVG, node.localName) : document.createElement(node.localName);
  const props = {}; let h = null;
  for (const a of node.attributes) {
    const name = a.name, c = __parts(a.value), low = name.toLowerCase();
    if (low.startsWith('hint-placeholder')) continue;
    if (__EVT[low]) { const fn = c.whole ? __get(c.whole, scope) : null; if (typeof fn === 'function') (h = h || {})[__EVT[low]] = fn; continue; }
    if (c.whole) {
      const v = __get(c.whole, scope);
      if ((name === 'value' || name === 'checked') && (el.localName === 'input' || el.localName === 'select' || el.localName === 'textarea')) { props[name] = v; if (name === 'value' && el.localName !== 'select' && v != null) el.setAttribute('value', String(v)); continue; }
      if (v == null || v === false) continue;
      if (__BOOL.has(low)) { el.setAttribute(name, ''); continue; }
      el.setAttribute(name, v === true ? '' : String(v));
    } else el.setAttribute(name, __str(c, scope));
  }
  if (h) el.__h = h;
  if (props.value !== undefined || props.checked !== undefined) el.__p = props;
  const kids = [];
  for (const ch of node.childNodes) __build(ch, scope, kids);
  for (const k of kids) el.appendChild(k);
  if (el.__p) __applyProps(el);
  if (el.localName === 'textarea' && props.value != null) el.textContent = String(props.value);
  return void out.push(el);
}
function __applyProps(el) {
  const p = el.__p; if (!p) return;
  if (p.value !== undefined && p.value !== null) { const v = String(p.value); if (el.value !== v) el.value = v; }
  if (p.checked !== undefined) el.checked = !!p.checked;
}
function __same(o, n) { return o.nodeType === n.nodeType && (o.nodeType !== 1 || (o.localName === n.localName && o.namespaceURI === n.namespaceURI)); }
function __sync(o, n) {
  if (o.nodeType === 3) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
  if (o.nodeType !== 1) return;
  for (const a of [...o.attributes]) if (!n.hasAttribute(a.name)) o.removeAttribute(a.name);
  for (const a of n.attributes) if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value);
  o.__h = n.__h; o.__p = n.__p;
  __morph(o, n);
  __applyProps(o);
}
function __morph(op, np) {
  const olds = [...op.childNodes], news = [...np.childNodes];
  for (let i = 0; i < news.length; i++) {
    const n = news[i], o = olds[i];
    if (!o) op.appendChild(n);
    else if (__same(o, n)) __sync(o, n);
    else op.replaceChild(n, o);
  }
  for (let i = news.length; i < olds.length; i++) op.removeChild(olds[i]);
}
function __prepare(tpl) {
  tpl = tpl.replace(/<sc-(if|for)(\s|>)/g, '<template data-sc="$1"$2').replace(/<\/sc-(if|for)>/g, '</template>');
  const t = document.createElement('template'); t.innerHTML = tpl; return t.content;
}
function __mount(Comp, templateHtml, root) {
  const hm = /<helmet>([\s\S]*?)<\/helmet>/.exec(templateHtml);
  if (hm) {
    const ht = document.createElement('template'); ht.innerHTML = hm[1];
    for (const el of [...ht.content.children]) { if (el.localName === 'meta') continue; document.head.appendChild(el); }
    templateHtml = templateHtml.replace(hm[0], '');
  }
  const frag = __prepare(templateHtml);
  const comp = new Comp({});
  let queued = false, mounted = false;
  const render = () => {
    queued = false;
    let vals; try { vals = comp.renderVals() || {}; } catch (e) { console.error('[render] renderVals gagal', e); return; }
    const scope = Object.create(vals);
    const out = []; for (const ch of frag.childNodes) __build(ch, scope, out);
    const holder = document.createElement('div'); for (const k of out) holder.appendChild(k);
    if (!mounted) { while (holder.firstChild) root.appendChild(holder.firstChild); mounted = true; comp.componentDidMount(); }
    else { __morph(root, holder); comp.componentDidUpdate({}); }
    const cbs = comp.__cbs; comp.__cbs = []; cbs.forEach(f => { try { f(); } catch (e) {} });
  };
  comp.__schedule = () => { if (!queued) { queued = true; queueMicrotask(render); } };
  const dispatch = (type, e) => {
    let el = e.target;
    while (el && el !== root.parentNode) {
      const h = el.__h;
      if (h) {
        let fn = h[type];
        if (type === 'input' && !fn && h.change && /^(input|textarea)$/.test(el.localName) && !/^(checkbox|radio|file)$/.test(el.type)) fn = h.change;
        if (type === 'change' && h.change && !(/^(input|textarea)$/.test(el.localName) && !/^(checkbox|radio|file)$/.test(el.type))) fn = h.change; else if (type === 'change') fn = h.__none;
        if (fn) { fn.call(comp, e); if (e.cancelBubble) break; }
      }
      el = el.parentNode;
    }
  };
  ['click', 'input', 'change', 'dragstart', 'dragover', 'drop', 'keydown', 'focusout', 'focusin'].forEach(t => root.addEventListener(t, e => dispatch(t, e), true));
  render();
  return comp;
}
