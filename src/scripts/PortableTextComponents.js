import {PROJECT_ID, DATASET} from './sanity-config';

export const myPortableTextComponents = {
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