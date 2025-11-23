package net.charno.utils;

import java.util.HashMap;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 *
 * @author mdc502
 */
public class XMLUtils {

    public static Document xmlToDoc(String xml) {
        Document doc = null;
        try {
            DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();

            doc = docBuilder.parse(xml);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return doc;
    }

    public static String getSingleValue(Element e, String s) {
        String value = null;
        NodeList nodeList = e.getElementsByTagName(s);
        if (nodeList.getLength() > 0) {
            Element _e = (Element) nodeList.item(0);
            NodeList eValue = _e.getChildNodes();
            if (eValue.getLength() > 0) {
                value = eValue.item(0).getNodeValue();
            }
        }

        return value;
    }

    public static Map<String, String> getAttributes(Element e) {
        Map results = new HashMap();
        for (int i = 0; i < e.getAttributes().getLength(); i++) {
            results.put(e.getAttributes().item(i).getNodeName(), e.getAttributes().item(i).getNodeValue());
        }
        return results;
    }
}
