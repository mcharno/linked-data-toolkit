
package net.charno.utils;

import java.util.ArrayList;
import java.util.List;
import net.charno.semweb.bindings.URILabelBinding;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class LoCSAXHandler extends DefaultHandler {
    
    /**
     * Flag to signify a uri was found in the XML.
     */
    private boolean uriFound = false;
    private boolean literalFound = false;
    private String node = null;
    private URILabelBinding locBinding;
    private List<URILabelBinding> resultList;
    
    /**
     * Overriding the startElement method to check if a uri was found in the 
     * XML result.
     * 
     * @param uri
     * @param localName
     * @param qName The only element we're interested in.
     * @param attributes
     * @throws SAXException 
     */
    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        if ("uri".equals(qName)) {
            uriFound = true;
            locBinding = new URILabelBinding();
        } else if ("literal".equals(qName)) {
            literalFound = true;
        }
    }
    
    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        if ("result".equals(qName)) {
            resultList.add(locBinding);
        }
    }
    
    /**
     * Overriding the characters method to set the node if a uri was found in 
     * the startElement method.
     * 
     * @param ch
     * @param start
     * @param length
     * @throws SAXException 
     */
    @Override
    public void characters(char ch[], int start, int length) throws SAXException {
        if (uriFound && length > 10) {
            locBinding.setUri(new String(ch, start, length));
            uriFound = false;
        }
        if (literalFound) {
            locBinding.setLabel(new String(ch, start, length));
            literalFound = false;
        }
    }
    
    @Override
    public void startDocument() {
        resultList = new ArrayList<URILabelBinding>();
    }
    
    public List<URILabelBinding> getResultList() {
        return this.resultList;
    }
}
