import pkg from '../package.json';
// Incorporada no bundle: não consultar getManifest para identificar código antigo.
export const BUILD_VERSION=pkg.version;
export const PROTOCOL=10;
export function assertBuild(reply:{buildVersion?:string}|undefined):void{
 if(reply?.buildVersion!==BUILD_VERSION)throw Error(`Versões desencontradas. Esta tela é ${BUILD_VERSION}, mas o componente carregado é ${reply?.buildVersion??'antigo'}. Recarregue o EcoBot na página de extensões e depois recarregue a aba do jogo.`);
}
