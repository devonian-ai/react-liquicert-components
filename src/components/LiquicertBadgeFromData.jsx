import React, { Component } from 'react';
import '../styles/styles.css';
import josefinSlabBold from '../assets/fonts/josefin-slab/JosefinSlab-Bold.ttf';
import josefinSlabRegular from '../assets/fonts/josefin-slab/JosefinSlab-Regular.ttf';
import {shortenAddress} from '../shortenAddress';
import liquicert_embed_trusted from '../assets/liquicert_embed_trusted.png';
import liquicert_embed_nottrusted from '../assets/liquicert_embed_nottrusted.png';
import liquicert_embed_invalid from '../assets/liquicert_embed_invalid.png';
import Cert_Flourish from '../assets/Cert_Flourish.jpg';
import LiquiCert_Badge from '../assets/LiquiCert_Badge.png';
import Checkbox from '../assets/Checkbox.png';
import Xbox from '../assets/Xbox.png';
import cursorImg from '../assets/cursor.png';
import LiquiCert_Seal_Green from '../assets/LiquiCert_Seal_Green.png';
import LiquiCert_Seal_Red from '../assets/LiquiCert_Seal_Red.png';
import LiquiCert_Seal_Inactive from '../assets/LiquiCert_Seal_Inactive.png';
import subway_start_g from '../assets/subway/subway_start_g.jpg';
import subway_start_r from '../assets/subway/subway_start_r.jpg';
import subway_start_b from '../assets/subway/subway_start_b.jpg';
import subway_middle_g_g from '../assets/subway/subway_middle_g_g.jpg';
import subway_middle_r_g from '../assets/subway/subway_middle_r_g.jpg'; // ie signal comes in red, this link is green
import subway_middle_b_g from '../assets/subway/subway_middle_b_g.jpg';
import subway_middle_g_r from '../assets/subway/subway_middle_g_r.jpg';
import subway_middle_r_r from '../assets/subway/subway_middle_r_r.jpg';
import subway_middle_b_r from '../assets/subway/subway_middle_b_r.jpg';
import subway_end_g_g from '../assets/subway/subway_end_g_g.jpg';
import subway_end_r_g from '../assets/subway/subway_end_r_g.jpg';
import subway_end_b_g from '../assets/subway/subway_end_b_g.jpg';
import subway_end_g_r from '../assets/subway/subway_end_g_r.jpg';
import subway_end_r_r from '../assets/subway/subway_end_r_r.jpg';
import subway_end_b_r from '../assets/subway/subway_end_b_r.jpg';

class LiquicertBadgeFromData extends Component {

    // Add event listeners to handle interaction, after the component loads
    componentDidMount() {
        this.addEventListeners();
        this.injectFontStyles();
    }

    componentDidUpdate(prevProps) {
        // Only add event listeners if the relevant props have changed
        if (prevProps.pathInfo !== this.props.pathInfo || prevProps.assetName !== this.props.assetName || prevProps.communityData !== this.props.communityData) {
            this.removeEventListeners();
            this.addEventListeners();
        }
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    addEventListeners = () => {
        const badgeImage = document.getElementById('badgeImage');
        const previewDiv = document.getElementById('preview');

        if (badgeImage) {
            // Function to update the preview position
            const updatePreviewPosition = (x, y) => {
                previewDiv.style.left = `${x + 10}px`;
                previewDiv.style.top = `${y + 10}px`;
            };

            badgeImage.addEventListener('mouseover', this.handleMouseOver = (event) => {
                previewDiv.style.display = 'block';
                updatePreviewPosition(event.clientX, event.clientY);
            });

            badgeImage.addEventListener('mousemove', this.handleMouseMove = (event) => {
                updatePreviewPosition(event.clientX, event.clientY);
            });

            badgeImage.addEventListener('mouseout', this.handleMouseOut = () => {
                previewDiv.style.display = 'none';
            });

            // Store the reference to remove them later
            this.badgeImage = badgeImage;
            this.updatePreviewPosition = updatePreviewPosition;
        }
    }

    removeEventListeners = () => {
        const { badgeImage } = this;
        if (badgeImage) {
            badgeImage.removeEventListener('mouseover', this.handleMouseOver);
            badgeImage.removeEventListener('mousemove', this.handleMouseMove);
            badgeImage.removeEventListener('mouseout', this.handleMouseOut);
        }
    }

    injectFontStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            @font-face {
                font-family: 'Josefin Slab Bold';
                src: url(${josefinSlabBold}) format('truetype');
                font-weight: bold;
                font-style: normal;
            }
            @font-face {
                font-family: 'Josefin Slab';
                src: url(${josefinSlabRegular}) format('truetype');
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);
    }

    render() {

        if (!this.props.pathInfo || !this.props.assetName || !this.props.communityData) {
            return (
                <div>
                    <div>Loading...</div>
                    {/* <div className='badgeImage' /> */}
                </div>
                );
        }

        // Figure out which badge image to embed
        let embedImg = liquicert_embed_invalid;
        try{
            if (this.props.pathInfo.trusted) {embedImg = liquicert_embed_trusted};
            if (!this.props.pathInfo.trusted) {embedImg = liquicert_embed_nottrusted};
        }catch{console.log('Problem with badge info, possibly pathInfo is null or undefined')}

        // Message and styling for overall trust path
        let trustBoxImage = Xbox;
        let pathTrustValue = "Not Trusted ";
        let pathTrustStyle = 'path-certificate-not-trusted-small-superbold';
        if (this.props.pathInfo.trusted){
            trustBoxImage = Checkbox;
            pathTrustValue = "Trusted ";
            pathTrustStyle = 'path-certificate-trusted-small-superbold';
        }

        // Message and styling for last path element
        let attestationTrustValue = "Does Not Trust ";
        let attestationTrustStyle = 'path-certificate-not-trusted';
        if (this.props.pathInfo.attestation.trusted){
            attestationTrustValue = "Trusts ";
            attestationTrustStyle = 'path-certificate-trusted';
            if (!(this.props.pathInfo.trusted)){attestationTrustStyle = 'path-certificate-trusted-inactive';}
        }

        let trustSeal = LiquiCert_Seal_Red
        if (this.props.pathInfo.trusted) {trustSeal = LiquiCert_Seal_Green}
        if (this.props.pathInfo.trusted == null) {trustSeal = LiquiCert_Seal_Inactive}

        // Track whether we've gone past a link in the trust chain that doesn't trust; affects styling later on
        let passedNoTrust = false;

        // Figure out what the final subway image is
        let lastImage = subway_end_g_g;
        if (this.props.pathInfo.trusted == false) {
            if (this.props.pathInfo.attestation.trusted == true) {
                lastImage = subway_end_r_g;
            }
            if (this.props.pathInfo.attestation.trusted == false) {
                lastImage = subway_end_g_r;
            }
        }
        if (this.props.pathInfo.trusted == null) {
            // Not enough information to tell
            lastImage = subway_end_b_g;
        }

        // As we loop through the path, track whether or not the current link is trusted
        let currentTrust = this.props.pathInfo.validPath[0].trusted; 



        return (
            <div>
                {/* <p>LC Badge Componnent From Datta</p> */}
                {/* <p>{JSON.stringify(this.props.pathInfo)}</p> */}
                {/* <p>{this.props.assetName}</p> */}
                {/* <p>{JSON.stringify(this.props.communityData)}</p> */}
                {/* <p>{this.props.pathCID}</p> */}
                <a href={`https://liquicert.io/attestation?trustpath=${this.props.pathCID}`} target="_blank" className="no-underline">
                    <img src={embedImg} className='badgeImage' id="badgeImage" />
                </a>
                <div id="preview" className="previewCard">
                    <img src={Cert_Flourish} style={{width:'70px', height:'auto'}}></img>
                    <p className="path-certificate-title">{`${this.props.assetName} Trust Path:`}</p>
                    <div style={{ width: '350px'}}>
                        <div style ={{width: '350px'}}>
                            {
                                this.props.pathInfo.validPath.map((item, index) => {
                                    if(!(this.props.pathInfo.validPath[index].trusted)){
                                        passedNoTrust = true}
                                    if (index == 0) {
                                        const returnMessage = `The ${getCommunityNameFromAddress(item.address, this.props.communityData)} community`
                                        let subwayImg = subway_start_g;
                                        if (item.trusted == false) {subwayImg = subway_start_r}; // Currently this would never happen
                                        if (item.trusted == null) {subwayImg = subway_start_b};
                                        return (
                                            <div style={{ textAlign: 'left', display:'flex', marginLeft:'10px', paddingTop:'10px'}} key={`trustRow_${index}`}>
                                                <img src={subwayImg} style={{width:'12px', height:'auto', marginRight:'15px'}}></img>
                                                <span className="path-certificate-plaintext">{returnMessage}</span>
                                            </div>)
                                    } else {
                                        let trustValue = "Does Not Trust ";
                                        let trustStyle = 'path-certificate-not-trusted';
                                        if (this.props.pathInfo.validPath[index-1].trusted){
                                            // console.log('Setting truthy style')
                                            trustValue = "Trusts ";
                                            trustStyle = 'path-certificate-trusted';
                                            if(passedNoTrust) {
                                                // console.log("triggering because passed no trust")
                                                    trustStyle = 'path-certificate-trusted-inactive'}
                                            // console.log(trustStyle)
                                        }
                                        let whoMessage = ', who'
                                        let nextImage = subway_middle_g_g;
                                        if (currentTrust == true) {
                                            // If this link is trusted do nothing
                                            if (item.trusted == false) {
                                                nextImage = subway_middle_g_r;
                                                currentTrust = false;
                                            }
                                        }
                                        if (currentTrust == false) {
                                            if (item.trusted == true) {
                                                nextImage = subway_middle_r_g;
                                                // Nothing to current trust
                                            }
                                            if (item.trusted == false) {
                                                nextImage = subway_middle_r_r;
                                                currentTrust = null;
                                            }
                                        }
                                        if (currentTrust == null) {
                                            if (item.trusted == true) {
                                                nextImage = subway_middle_b_g;
                                            }
                                            if (item.trusted == false) {
                                                nextImage = subway_middle_b_r;
                                            }
                                        }
                                        return (
                                            <div style={{ textAlign: 'left', display:'flex', marginLeft:'10px', alignItems: 'center'}} key={`trustRow_${index}`}>
                                                <img src={nextImage} style={{width:'12px', height:'auto', marginRight:'15px'}}></img>
                                                <span className={trustStyle} style={{ marginRight: '5px', paddingTop:'3px'}}>{trustValue} </span>
                                                <span className={"path-certificate-plaintext"} style={{paddingTop:'3px'}}>{getCommunityNameFromAddress(item.address, this.props.communityData)}</span>
                                                <span className={"path-certificate-plaintext"} style={{paddingTop:'3px'}}>{whoMessage} </span>
                                            </div>
                                        )
                                    }
                                })
                            }
                            {/* Final trust line, covering this asset */}
                            <div style={{ textAlign: 'left', display:'flex', marginLeft:'10px', alignItems: 'center'}} key={`trustRow_${this.props.pathInfo.validPath.length+1}`}>
                                {/* Have to use conditional logic because the last image depends on the currentTrust state immediately before */}
                                {
                                    this.props.pathInfo.trusted === null && currentTrust === false ? (
                                        <img src={subway_end_r_r} style={{width: '12px', height: 'auto', marginRight: '15px', alignSelf: 'flex-start'}} />
                                    ) : (
                                        <img src={lastImage} style={{width: '12px', height: 'auto', marginRight: '15px', alignSelf: 'flex-start'}} />
                                    )
                                }
                                <span className={attestationTrustStyle} style={{ marginRight: '5px', paddingTop:'4px'}}>{attestationTrustValue} </span>
                                <span className={"path-certificate-plaintext"} style={{paddingTop:'4px'}}>{this.props.assetName}</span>
                            </div>
                        </div>
                        <div style={{display:'flex', marginTop:'10px'}}>
                            <div>
                                <img src={trustSeal} style={{width:'90px', height:'auto', paddingTop:'8px'}}></img>
                            </div>
                            <div>
                                <div style={{ textAlign: 'left', display:'flex', marginLeft:'30px', paddingTop:'10px'}}>
                                    <img src={trustBoxImage} style={{width:'13px', height:'13px', marginRight:'5px'}}></img>
                                    <span className={"path-certificate-paragraph-small-superbold"} style={{whiteSpace: 'pre'}}>{"The data is "}</span>
                                    <span className={pathTrustStyle} style={{whiteSpace: 'pre'}}>{pathTrustValue}</span>
                                    <span className={"path-certificate-paragraph-small-superbold"} style={{whiteSpace: 'pre'}}>{"along this path"}</span>
                                </div>
                                <div style={{ textAlign: 'left', display:'flex', marginLeft:'30px', paddingTop:'10px'}}>
                                    <img src={Checkbox} style={{width:'13px', height:'13px', marginRight:'5px'}}></img>
                                    <span className={"path-certificate-paragraph-small-superbold"} style={{whiteSpace: 'pre'}}>{"Path is valid"}</span>
                                </div>
                                <div style={{ textAlign: 'left', display:'flex', marginLeft:'30px', paddingTop:'10px'}}>
                                    <img src={cursorImg} style={{width:'13px', height:'13px', marginRight:'5px'}}></img>
                                    <span className={"path-certificate-paragraph-small-superbold"} style={{whiteSpace: 'pre'}}>{"Click for more information"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Try to get the name. If there isn't a community name, just return the address
function getCommunityNameFromAddress(address, communityData) {
    let toReturn = shortenAddress(address);
    communityData.forEach((item, index) =>{
        // console.log(item)
        if (item.address == address) {toReturn = item.description}
    })
    return toReturn
}

export default LiquicertBadgeFromData;